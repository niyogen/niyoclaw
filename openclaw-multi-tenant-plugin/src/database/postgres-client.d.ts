import 'dotenv/config';
/**
 * Executes a query securely against the live PostgreSQL database.
 */
export declare function query(sql: string, params?: any[]): Promise<import("pg").QueryResult<any>>;
export declare function pingDatabase(): Promise<boolean>;
//# sourceMappingURL=postgres-client.d.ts.map