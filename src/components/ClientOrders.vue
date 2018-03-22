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
            <th>High Dem. Rate</th>
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
          <td>&#8358;{{ order.highDenominationRate}} per {{ order.cardCurrency }} </td>
          <td>{{ order.bankAccountNumber}}  {{ order.bankName }} </td>
          <td>{{ order.status }}</td>
          <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
          <td class="viewCardButton">
            <span v-on:click="viewCards(order.orderId)" class="actionSpan">
              View cards &nbsp;
            </span>
             <span v-on:click="sendFeedback(order.orderId)" class="actionSpan">
              Send Feedback
            </span>
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

    <!-- giftcard modal -->
    <div
      class="w3-third"
      v-for="(giftcardUrl,index) in giftcardsUrl"
      v-bind:key="index"
    >
      <div class="w3-card">
        <img v-bind:src="giftcardUrl" style="width:100%">
      </div>
    </div>
    <!-- modal ends here -->
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
    viewCards(orderId) {
      this.showCards = true;
      const currentOrder = this.orders
        .filter(order => order.orderId === orderId)[0];
      const giftcardsUrl = currentOrder.giftcardsUrl.split('||');
      // to remove the last empty item in the list
      giftcardsUrl.pop();
      this.giftcardsUrl = giftcardsUrl;
      this.CurrentOrderDiv = { display: 'block' };
    },
    sendFeedback(orderId) {
      const currentOrder = this.orders
        .filter(order => order.orderId === orderId)[0];
      const email = currentOrder.email;
      this.$router.push({ path: `/adminFeedback/${orderId}/${email}` });
    },
    getOrders(page = 0) {
      let pageIndex = page;
      if (page > 0) {
        pageIndex = page - 1;
      }
      const offset = pageIndex * 3;
      if (page !== this.curPage) {
        this.$store.dispatch('order/getOrders', { offset });
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
  data() {
    return {
      giftcardsUrl: null,
      CurrentOrderDiv: { display: 'none' },
    };
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
.viewCardButton {
  cursor: pointer;
  font-style: italic;
}
.actionSpan:hover{
  text-decoration: underline;
}
</style>
