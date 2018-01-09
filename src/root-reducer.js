import { combineReducers } from 'redux'

import userReducer from './common/state/user/reducer'
import listsReducer from './common/state/lists/reducer'
import guardiansReducer from './common/state/guardians/reducer'

export default combineReducers({
  user: userReducer,
  lists: listsReducer,
  guardians: guardiansReducer,
})
