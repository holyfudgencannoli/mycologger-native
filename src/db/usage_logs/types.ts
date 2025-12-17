export interface UsageLogType {
    id: number;
    type: string;
    item_id: number,
    task_id: number,
    usage_amout: number,
    usage_unit: string,
    notes: string,
    last_updated: number,
}