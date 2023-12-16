import { request } from './axios'

export class DataService {
    // 查询 余额、收入、支出（T1后端云聚合查询）
    static async getTotal() {
        return request(
            `/v5/classes/${import.meta.env.VITE_APP_HISTORY_TABLE}/aggregate`,
            [
                {
                    $group: {
                        _id: '$type',
                        totalAmount: { $sum: '$amount' },
                    },
                },
            ],
            'post',
        )
    }

    // 查询 History（T1后端云高级查询）
    static async getHistory(page: number, size: number) {
        return request(
            `/v5/classes/${import.meta.env.VITE_APP_HISTORY_TABLE}/query`,
            {
                page: page,
                size: size,
                sort: { createdAt: -1 },
                body: {},
            },
            'post',
        )
    }

    // 添加 History
    static async addTransaction(params: any) {
        return request(
            `/v5/classes/${import.meta.env.VITE_APP_HISTORY_TABLE}`,
            params,
            'post',
        )
    }

    // 删除 History
    static async deleteTransaction(id: string) {
        return request(
            `/v5/classes/${import.meta.env.VITE_APP_HISTORY_TABLE}/${id}`,
            {},
            'delete',
        )
    }
}
