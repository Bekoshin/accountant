export interface HomeState {}

const initialState: HomeState = {};

export default (state = initialState, action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};
