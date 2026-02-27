import { Router, Route } from '@redwoodjs/router'

const Routes = () => {
  return (
    <Router>
      <Route path="/" page={HomePage} name="home" />
      <Route path="/deals/new" page={NewDealPage} name="newDeal" />
      <Route path="/thank-you" page={ThankYouPage} name="thankYou" />
      <Route path="/admin" page={AdminPage} name="admin" />
      <Route path="/admin/deals" page={AdminDealsPage} name="adminDeals" />
      <Route path="/admin/deals/{id:String}" page={AdminEditDealPage} name="adminEditDeal" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
