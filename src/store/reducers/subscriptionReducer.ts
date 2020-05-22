import {ACTION_TYPES} from '../ACTION_TYPES';
import Subscription from '../../entities/Subscription';

type SubscriptionState = {
  subscriptions: Subscription[];
};

type Action = {
  type: string;
  subscriptions: Subscription[];
};

const initialState: SubscriptionState = {
  subscriptions: [],
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPES.SUBSCRIPTIONS_LOADED: {
      return {
        ...state,
        subscriptions: action.subscriptions,
      };
    }
    default:
      return state;
  }
};
