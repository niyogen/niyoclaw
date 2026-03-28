export declare function checkUserBalance(phoneNumberId: string): Promise<number>;
export declare function deductTokens(phoneNumberId: string, tokensUsed: number): Promise<void>;
export declare function logTokenUsage(phoneNumberId: string, endUserPhone: string, input: number, output: number): Promise<void>;
//# sourceMappingURL=queries-balances.d.ts.map