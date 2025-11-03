import {
    PrivyClient
} from "@privy-io/server-auth";

export function getPrivyClient(): PrivyClient {
    return new PrivyClient(
        process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
        process.env.NEXT_PUBLIC_PRIVY_APP_SECRET!,
    );
}   