import Vue from 'vue';
import {gets as getProductItems, get as getProductData} from '../../api';

export default {
    namespaced: true,
    state: {
        items: [],
        freshItems: [],
        popularItems: [],
        boughtWithItems: [],
        sort: 'price_asc',
        checked: [],
        minRange: '',
        maxRange: '',
        slider: {
            startMin: '',
            startMax: '',
        }
    },
    getters: {
        getItems(state) {
            return state.items;
        },
        getProductById(state) {
            return (id) => state.items.find(item => item.id === parseInt(id));
        },
        getPopularItems(state) {
            return state.popularItems;
        },
        getFreshItems(state) {
            return state.freshItems;
        },
        getBoughtWithItems(state) {
            return state.boughtWithItems;
        },
        getSort(state) {
            return state.sort;
        },

        /*
        * FILTER GETTERS
        * */
        getChecked(state) {
            return state.checked;
        },
        getCheckedCount(state) {
            return state.checked.length;
        },
        getSliderMinRange(state) {
            return state.minRange;
        },
        getSliderMaxRange(state) {
            return state.maxRange;
        },
        getSliderStartMin(state) {
            return state.slider.startMin;
        },
        getSliderStartMax(state) {
            return state.slider.startMax;
        },
    },
    mutations: {
        mutateCheckFilters(state, data) {
            let found = state.checked.find(item => item.filter === data.filter);

            if (found) {
                found.filter = data.filter;
                found.values = data.values;
            }
            else {
                state.checked.push({
                    filter: data.filter,
                    values: data.values
                });
            }
        },
        mutateClearItems(state) {
            state.items = [];
        },
        mutateLoadItems(state, data) {
            state.items = data;
        },
        mutateLoadFreshItems(state, data) {
            state.freshItems = data;
        },
        mutateLoadPopularItems(state, data) {
            state.popularItems = data;
        },
        mutateLoadBoughtWithItems(state, data) {
            state.boughtWithItems = data;
        },
        mutateProductSelectedVariant(state, obj) {
              let found = state.items.find(item => item.id === obj.product.id)
                  || state.freshItems.find(item => item.id === obj.product.id)
                  || state.popularItems.find(item => item.id === obj.product.id);
            if (found) {
                  console.log(1);

                  let foundVariant = found.variants.find(item => item.name === obj.variant.name);

                  if (foundVariant) {
                      if (foundVariant.selected) {
                          foundVariant.selected = obj.value;
                      }
                      else {
                          Vue.set(foundVariant, 'selected', obj.value)
                      }
                  }
              }
        },
        mutateSort(state, value) {
            state.sort = value;
        },
        /*
        * FILTER MUTATIONS
        * */
        mutateClearCheckedParams(state, filter) {
            let found = state.checked.find(item => item.filter === filter.name);
            let index = state.checked.indexOf(found);

            if (index > -1) {
                state.checked.splice(index, 1);
            }
        },
        mutateMinRange(state, value) {
            state.minRange = value;
        },
        mutateMaxRange(state, value) {
            state.maxRange = value;
        },
        mutateStartMin(state, value) {
            state.slider.startMin = value;
        },
        mutateStartMax(state, value) {
            state.slider.startMax = value;
        },
    },
    actions: {
        setProductSelectedVariantInProducts(store, obj) {
            store.commit('mutateProductSelectedVariant', obj);
        },
        loadItems(store, data){
            store.commit('mutateLoadItems', data);
        },
        clearItems(store) {
            store.commit('mutateClearItems');
        },
        sortChange(store, value) {
            store.commit('mutateSort', value);
        },
        /*
        * FILTER ACTIONS
        * */
        clearCheckedParams(store, filter) {
            store.commit('mutateClearCheckedParams', filter);
        },
        checkFilter(store, data) {
            store.commit('mutateCheckFilters', data);
        },
        changeMinRange(store, value) {
            store.commit('mutateMinRange', value);
        },
        changeMaxRange(store, value) {
            store.commit('mutateMaxRange', value);
        },
        changeStartMax(store, value) {
            store.commit('mutateStartMax', value);
        },
        changeStartMin(store, value) {
            store.commit('mutateStartMin', value);
        },
        setProductItems({commit, state}, param) {
            let options = {
                sort: state.sort,
                min : state.minRange,
                max: state.maxRange,
            };

            options = { ...param, ...options };

            getProductItems('/store/catalog', options, state.checked,
                (data) => {
                    commit('mutateLoadItems', data);
                }
            );
        },
        setProductPopularItems({commit, state}, param) {
            let options = {
                sort: 'rating',
            };

            options = { ...param, ...options };

            getProductData('/store/catalog', options,
                (data) => {
                    commit('mutateLoadPopularItems', data);
                }
            );
        },
        setProductFreshItems({commit, state}, param) {
            let options = {
                sort: 'new',
            };

            options = { ...param, ...options };

            getProductData('/store/catalog', options,
                (data) => {
                    commit('mutateLoadFreshItems', data);
                }
            );
        },
        setProductBoughtWithItems({commit, state}, param) {

            getProductData('/store/catalog', param,
                (data) => {
                    commit('mutateLoadBoughtWithItems', data);
                }
            );
        },
        setBoughtWithItems({state,commit}, data) {
            commit('mutateLoadBoughtWithItems', data);
        }
    }
}
