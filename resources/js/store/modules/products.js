import Vue from 'vue';
import axios from "axios";

export default {
    namespaced: true,
    state: {
        items: [],
        sort: 'price_asc',

        /*
        *
        * FILTER
        *
        * */
        filteredItems: [],
        minRange: '',
        maxRange: '',
        slider: {
            startMin: 0,
            startMax: 0,
        }
    },
    getters: {
        getItems(state) {
            return state.items;
        },
        getSort(state) {
            return state.sort;
        },

        /*
        *
        * FILTER GETTERS
        *
        * */
        getFilteredItems(state) {
            return state.filteredItems;
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
        mutateClearItems(state) {
            state.items = [];
        },
        mutateLoadItems(state, data) {
            state.items = data;
        },
        mutateFavorite(state, product) {
            if (product.product === false) {
                Vue.set(product, 'product_favorite', true);
            } else {
                Vue.set(product, 'product_favorite', false);
            }
        },
        mutateProductCondition(state, obj) {
            let found = state.items.find(item => item.id === obj.product.id);
            if (found) {
                let foundCondition = found.product_conditions.find(item => item.name === obj.condition.name);

                if (foundCondition) {
                    foundCondition.selected = obj.selected;
                }
            }
        },
        mutateSort(state, value) {
            state.sort = value;
        },
        /*
        *
        * FILTER MUTATIONS
        *
        * */
        mutateAddToFiltered(state, product) {
            let found = state.filteredItems.find(item => item.id === product.id);

            if (!found) {
                state.filteredItems.push(product);
            }
        },
        mutateRemoveFromFiltered(state, product) {
            let found = state.filteredItems.find(item => item.id === product.id);
            let index = state.filteredItems.indexOf(found);
            if (index > -1) {
                state.filteredItems.splice(index, 1);
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

        like(store, product) {
            store.commit('mutateFavorite', product);
        },
        productConditionSelect(store, obj) {
            store.commit('mutateProductCondition', obj);
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
        *
        * FILTER MUTATIONS
        *
        * */
        addToFiltered(store, product) {
            store.commit('mutateAddToFiltered', product);
        },
        removeFromFiltered(store, product) {
            store.commit('mutateRemoveFromFiltered', product);
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
    }
}
