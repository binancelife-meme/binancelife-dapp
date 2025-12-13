import { User } from "../user";

import { Luckypot } from "./luckypot";

export type LuckypotParticipant = {
    id: string;
    luckypot: Luckypot;
    user: User;
    ticketCount: number;
    cost: string;
}