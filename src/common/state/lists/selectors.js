/* This only keep list item with non-empty data */
export const listsForServerSelector = state => {
  const lists = state.lists.lists
  return lists
    .map(list => {
      return list.filter(item => item.artistName !== '' || item.songName !== '')
    })
    .filter(list => list.length > 0)
}

// export const listInvoiceSelector = state => {
//   if (state.user && state.user.invoice) {
//     return {
//       songsTotal: state.user.invoice.totalSongs,
//       setCost: state.user.invoice.listCost,
//       totalCost: state.user.invoice.due,
//     }
//   }
//   return null
// }
