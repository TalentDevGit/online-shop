<template>
    <section class="params">
        <div class="wrapper-16">
            <div class="items">
                <ul class="list">
                    <li v-for="(name, value, index) in currentFilterValues" :key="index"
                        class="list__item">
                        <div class="checkbox">
                            <label class="checkbox__container">{{ name }}
                                <input class="checkbox__container__input" type="checkbox"
                                       :value="name"
                                       :name="name"
                                       v-model="checkedItems"
                                >
                                <span class="checkbox__container__checkmark"></span>
                            </label>
                        </div>
                    </li>
                </ul>
                <button class="btn"
                        @click.prevent="backToFilter"
                >применить</button>
            </div>
        </div>
    </section>
</template>
<script>
    import {mapGetters} from 'vuex';
    import {mapActions} from 'vuex';

    export default {
        beforeRouteEnter(to, from, next) {
            next(vm => {
                let checked = vm.$store.state.products.checked;
                let filter = checked.find(item => item.filter === to.params.filter_name);

                if (filter) {
                    filter.values.forEach(elem => {
                        vm.checkedItems.push(elem);
                    });
                }

                vm.changeTitle(to.params.filter_name);
            });
        },
        data() {
            return {
                checkedItems: []
            }
        },
        computed: {
            ...mapGetters('products', {
                products: 'getItems',
                checked: 'getChecked'
            }),
            currentFilter() {
                let properties = [];
                this.products.forEach(item => {
                    if (item.properties && item.properties.length > 0) {
                        item.properties.forEach(elem => {
                            properties.push(elem);
                        });
                    }
                });

                return properties.find(item => item.name === this.$route.params.filter_name);
            },
            currentFilterValues() {
                let values = [];
                this.products.forEach(item => {
                    if (item.properties && item.properties.length > 0) {
                        item.properties.forEach(elem => {
                            if (elem.name === this.currentFilter.name && values.includes(elem.value) === false) {
                                values.push(elem.value);
                            }
                        });
                    }
                });

                return values;
            }
        },
        methods: {
            ...mapActions('products', {
                check: 'checkFilter',
            }),
            ...mapActions('header', {
                changeTitle: 'setTitle'
            }),
            changeValue(data) {
                this.checkedItems = data;
            },
            backToFilter() {
                let modified = [];
                    this.checkedItems.forEach(item => {
                        modified.push({
                            name: this.currentFilter.name,
                            value: item,
                        });
                });
                this.check({
                    filter: this.currentFilter.name,
                    values: this.checkedItems
                });
                this.$router.replace({name: 'filter', params: {cat_id: this.$route.params.cat_id, keywords: this.$route.params.keywords} });
            }
        }
    }
</script>
