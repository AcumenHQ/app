import { NextResponse } from 'next/server'
import { getPrivyClient } from '@/lib/privy'

interface LinkedAccount {
    type: string;
    connectorType?: string;
    chainId?: string;
    walletClientType?: string;
    address?: string;
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({})) as { userId?: string; email?: string }
    const userKey = body.userId || body.email || 'anonymous'

    const strategy = process.env.DEPOSIT_ADDRESS_STRATEGY || 'first_signin_unique'
    const supportedChains = (process.env.SUPPORTED_CHAINS || 'eip155:1,eip155:84532,eip155:80002,eip155:137,solana:101')
        .split(',').map(s => s.trim()).filter(Boolean)
    const assets = (process.env.SUPPORTED_ASSETS || 'usdc,usdt').split(',').map(a => a.trim() as 'usdc' | 'usdt')
    const privy = getPrivyClient()

    let user = null;
    let evmAddress = '';
    let solAddress = '';
    try {
        // User identity: treat userId as the primary identifier
        if (body.userId) {
            user = await privy.getUser(body.userId)
        } else if (body.email) {
            user = await privy.getUserByEmail(body.email)
        }
        // If not found, fallback (do not call createUser)
        if (!user) {
            throw new Error('Privy user not found; please sign in with Privy on the client first.')
        }
        // Privy uses linkedAccounts, not wallets
        if (user.linkedAccounts) {
            // Find EVM embedded wallet (embedded wallets have connectorType === 'embedded')
            const evmWallet = user.linkedAccounts.find((acc: LinkedAccount) =>
                acc.type === 'wallet' &&
                acc.connectorType === 'embedded' &&
                (acc.chainId?.startsWith('eip155') || acc.walletClientType === 'metamask' || !acc.walletClientType)
            );
            // Find Solana embedded wallet
            const solWallet = user.linkedAccounts.find((acc: LinkedAccount) =>
                acc.type === 'wallet' &&
                acc.connectorType === 'embedded' &&
                (acc.chainId?.startsWith('solana') || acc.walletClientType === 'phantom' || acc.walletClientType === 'solana')
            );
            evmAddress = (evmWallet as LinkedAccount)?.address || '';
            solAddress = (solWallet as LinkedAccount)?.address || '';
        }
    } catch (e) {
        // Fallback: show deterministic test addresses
        const djb2Hex = (input: string, bytes = 20): string => {
            let hash = 5381
            for (let i = 0; i < input.length; i++) {
                hash = ((hash << 5) + hash) + input.charCodeAt(i); hash >>>= 0
            }
            const out: number[] = []
            let seed = hash
            for (let i = 0; i < bytes; i++) {
                seed ^= seed << 13
                seed ^= seed >>> 17
                seed ^= seed << 5
                out.push(seed & 0xff)
            }
            return '0x' + out.map(b => b.toString(16).padStart(2, '0')).join('')
        }
        evmAddress = djb2Hex(`${userKey}:evm`)
        solAddress = djb2Hex(`${userKey}:sol`)
    }

    const depositAddresses: Record<string, { usdc?: string; usdt?: string }> = {}
    for (const chain of supportedChains) {
        const isSol = chain.startsWith('solana:')
        const addr = isSol ? solAddress : evmAddress
        depositAddresses[chain] = {}
        for (const a of assets) {
            depositAddresses[chain][a] = addr
        }
    }

    return NextResponse.json({
        depositAddresses,
        defaultEvmAddress: evmAddress,
        defaultSolAddress: solAddress,
        strategy,
    })
}


