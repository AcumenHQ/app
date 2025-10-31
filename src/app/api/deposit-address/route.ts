import { NextResponse } from 'next/server'

// Temporary endpoint to mint a deterministic pseudo deposit address for a given input.
// Replace with your wallet backend/custodial provider integration to return a real address.
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const input = searchParams.get('account') || 'anonymous'

    // djb2 hash
    let hash = 5381
    for (let i = 0; i < input.length; i++) {
        hash = ((hash << 5) + hash) + input.charCodeAt(i)
        hash = hash >>> 0
    }
    const bytes: number[] = []
    let seed = hash
    for (let i = 0; i < 20; i++) {
        seed ^= seed << 13
        seed ^= seed >>> 17
        seed ^= seed << 5
        bytes.push(seed & 0xff)
    }
    const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('')
    const address = `0x${hex}`

    return NextResponse.json({ address })
}


