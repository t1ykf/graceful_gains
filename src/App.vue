<template>
    <div>
        <h2>记账</h2>
        <div class="container">
            <div>
                <div>
                    <h4>余额</h4>
                    <h1>${{ totalAmount }}</h1>
                </div>
                <div class="inc-exp-container">
                    <div>
                        <h4>收入</h4>
                        <p class="money plus">+${{ totalIncome }}</p>
                    </div>
                    <div>
                        <h4>支出</h4>
                        <p class="money minus">-${{ totalExpense }}</p>
                    </div>
                </div>
            </div>
            <div>
                <h3>History</h3>
                <ul class="list">
                    <template
                        v-for="transaction in transactions"
                        :key="transaction._id">
                        <li :class="transaction.type">
                            {{ transaction.title }}
                            <span>${{ transaction.amount }}</span>
                            <button
                                class="delete-btn"
                                @click="deleteTransaction(transaction._id)">
                                X
                            </button>
                        </li>
                    </template>
                </ul>
                <button
                    v-if="transactions.length >= 10"
                    style="
                        width: 100%;
                        background-color: whitesmoke;
                        cursor: pointer;
                    "
                    @click="getHistoryMore">
                    Load more
                </button>
            </div>
            <div>
                <h3>添加记录</h3>
                <div class="form-control">
                    <label for="text">Title</label>
                    <input
                        v-model="record.title"
                        type="text"
                        placeholder="enter title..." />
                </div>
                <div class="form-control">
                    <label for="amount"
                        >Amount<br />
                        (negative - expense, positive - income)</label
                    >
                    <input
                        v-model="record.amount"
                        type="text"
                        placeholder="enter amount..." />
                </div>
                <button class="btn" @click="addTransaction">添加记录</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { DataService } from './api/api.ts'

const totalAmount = ref(0)
const totalIncome = ref(0)
const totalExpense = ref(0)

const getTotal = async () => {
    DataService.getTotal().then((res: any) => {
        if (res.data.data != null) {
            const minusObject = res.data.data.find(
                (item: any) => item._id === 'minus',
            )
            totalExpense.value = minusObject ? minusObject.totalAmount : 0
            const plusObject = res.data.data.find(
                (item: any) => item._id === 'plus',
            )
            totalIncome.value = plusObject ? plusObject.totalAmount : 0
            totalAmount.value = totalIncome.value - totalExpense.value
        } else {
            totalAmount.value = 0
            totalIncome.value = 0
            totalExpense.value = 0
        }
        getHistory()
    })
}

getTotal()

const transactions = ref<
    {
        _id: string
        type: string
        title: string
        amount: string
    }[]
>([])

let size = 10
const getHistory = async () => {
    DataService.getHistory(1, size).then((res: any) => {
        if (res && res.data.data) {
            transactions.value = res.data.data
        }
    })
}

const getHistoryMore = async () => {
    size += 10
    DataService.getHistory(1, size).then((res: any) => {
        // 这里只显示第一页的10条数据，若需显示更多，修改即可
        transactions.value = res.data.data
    })
}

const record = reactive({
    type: '',
    title: '',
    amount: 0,
})

const addTransaction = async () => {
    if (String(record.amount).startsWith('-')) {
        record.type = 'minus'
        record.amount = Math.abs(record.amount)
    } else {
        record.type = 'plus'
    }
    record.amount = Number(record.amount)
    DataService.addTransaction(record).then(() => {
        record.title = ''
        record.amount = 0
        getTotal()
    })
}

const deleteTransaction = async (id: string) => {
    DataService.deleteTransaction(id).then(() => {
        getTotal()
    })
}
</script>
