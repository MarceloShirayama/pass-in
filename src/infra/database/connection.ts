export type Connection = {
  query(query: string, params?: any[]): Promise<any[]>;
}