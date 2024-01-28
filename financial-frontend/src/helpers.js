export const url = "http://localhost:3007";
export const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

export function findTransactionsOfAMonth(finance, selectedDate) {
    return finance.allTransactions.filter((tx) => {
        const monthOfTx = new Date(tx.dateForDB).getMonth();
        const yearOfTx = new Date(tx.dateForDB).getFullYear();

        const targetMonth = selectedDate.getMonth();
        const targetYear = selectedDate.getFullYear();

        return monthOfTx === targetMonth && yearOfTx === targetYear;
      });
}