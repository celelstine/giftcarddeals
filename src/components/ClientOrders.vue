<template>
  <div class="w3-responsive">
    <div
      class="w3-center"
      v-if="messageForClientOrder">
      <p
        v-if="messageForClientOrder"
        class=" w3-block w3-padding w3-blue-grey">
        {{ message }}
      </p>
    </div>
    <div v-if="orders.length" class="w3-responsive  w3-center">
      <table
        class="w3-table-all w3-card-4 w3-hoverable"
        style="font-size: 12px;">
        <thead>
          <tr class="w3-blue-grey">
            <th>Order ID</th>
            <th>Card Name</th>
            <th>Rate</th>
            <th>Bank Details</th>
            <th>Status</th>
            <th>Date</th>
            <th> Action </th>
          </tr>
        </thead>
        <tr
          v-for="order in orders"
          v-bind:key="order.id">
          <td>{{ order.orderId }}</td>
          <td>{{ order.productName}}</td>
          <td>&#8358;{{ order.rate}} per {{ order.cardCurrency }} </td>
          <td>{{ order.bankAccountNumber}}  {{ order.bankName }} </td>
          <td>{{ order.status }}</td>
          <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
          <td>
            <router-link
              :to="{ name: 'orderFeedback', params: { orderId: order.orderId }}"
              class="w3-w3-blue-grey">
              Send Feedback
            </router-link>
          </td>
        </tr>
      </table>
      <div class="w3-bar">
        <a
          class="w3-button"
          v-if="pageCount>1&&curPage>1"
          v-on:click="getOrders(curPage-1)">
            «prev
        </a>
        <a
          class="w3-button"
          v-for="index in pageCount"
          v-bind:key="index"
          v-on:click="getOrders(index)">
            <span v-if="index===curPage" class="activePage">
              {{ index }}
            </span>
            <span v-else class="otherPage">
              {{ index }}
            </span>
        </a>
        <a
          class="w3-button"
          v-if="pageCount>1&&curPage<pageCount"
          v-on:click="getOrders(curPage+1)">
            next»
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ClientOrders',
  mounted() {
    this.getOrders();
  },
  methods: {
    getOrders(page = 0) {
      /* eslint-disable no-console */
      console.log('current page is', page);
      let pageIndex = page;
      if (page > 0) {
        pageIndex = page - 1;
      }
      const offset = pageIndex * 3;
      if (page !== this.curPage) {
        this.$store.dispatch('staffEmail/getOrders', { offset });
      }
    },
  },
  computed: {
    ...mapState('order', {
      orders: state => state.orders,
      messageForClientOrder: state => state.messageForClientOrder,
      message: state => state.message,
      curPage: state => state.curPage,
      pageCount: state => state.pageCount,
    }),
  },
};
</script>
<style>
.activePage{
  color: #164254;
}
.otherPage {
  color: blue;
}
</style>
