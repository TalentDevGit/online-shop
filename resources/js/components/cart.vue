<template>
    <div>
        <section class="cart" v-if="countProductsInCart !== 0">
            <div class="items">
                <div class="incart">
                    <div class="cart-item"
                         v-for="(cartItem, index) in productsInCart"
                         :key="index"
                    >
                        <div class="cart-item__body swipable">
                            <div class="cart-item__body__product">
                                <router-link tag="div" :to="{ name: 'product', params: { item_id: cartItem.item.id } }" class="cart-item__body__product__img">
                                    <a href=""><img :src="'/images/' + cartItem.item.images[0].large" alt=""></a>
                                </router-link>
                                <div class="cart-item__body__product__details">
                                    <p class="cart-item__body__product__details__name">{{ cartItem.item.name }}</p>
                                    <div class="cart-item__body__product__details__prices">
                                        <p v-show="cartItem.item.discount === 0" class="cart-item__body__product__details__prices__nodiscount">{{ cartItem.item.price }} <span>руб.</span></p>
                                        <p v-show="cartItem.item.discount !== 0" class="cart-item__body__product__details__prices__odlprice">{{ cartItem.item.price }}</p>
                                        <p v-show="cartItem.item.discount !== 0" class="cart-item__body__product__details__prices__newprice">{{ cartItem.item.price - cartItem.item.discount }} <span>руб.</span></p>
                                        <p class="cart-item__body__product__details__prices__amount">x {{ cartItem.qty }} шт</p>
                                    </div>
                                </div>
                                <div class="cart-item__body__product__actions">
                                    <button class="cart-item__body__product__actions__menu"
                                            @click="popModal(cartItem.item)"
                                    ><img src="../../images/icons/product_menu.svg" alt=""></button>
                                    <button v-show="isFavorite(cartItem.item)" class="cart-item__body__product__actions__like"><img src="../../images/icons/favorite_fill.svg" alt=""></button>
                                </div>
                            </div>
                            <ul class="cart-item__body__conditions">
                                <li class="cart-item__body__conditions__item"
                                    v-for="(variant, index) in cartItem.item.variants" :key="index"
                                >{{ variant.name }}: <span> {{ variant.selected ? variant.selected : variant.values[0] }}</span></li>
                            </ul>
                        </div>
                        <div class="cart-item__buttons">
                            <button v-if="isFavorite(cartItem.item)"
                                    class="cart-item__buttons__like"
                                    @click="likeUnLike(cartItem.item)"
                            ><img src="../../images/icons/favorite_snow_fill.svg" alt=""></button>
                            <button v-else
                                    class="cart-item__buttons__like"
                                    @click="likeUnLike(cartItem.item)"
                            ><img src="../../images/icons/favorite_snow.svg" alt=""></button>
                            <button class="cart-item__buttons__close"
                                    @click="removeWithAllCounts(cartItem.item)"
                            ><img src="../../images/icons/close_snow.svg" alt=""></button>
                        </div>
                    </div>
                </div>
                <div class="promocode-wrapper" v-show="!promoApplied">
                    <div class="wrapper-16">
                        <div class="promocode" >
                            <input type="text"
                                   class="promocode__item promocode__input"
                                   name="promocode"
                                   placeholder="промокод"
                                   v-model="promo"
                                   @input="clearPromoErrors()"
                            >
                            <button class="promocode__item promocode__apply"
                                    @click="$auth.check() ? applyPromoCode() : $router.push({ name: 'start2' })"
                            >применить</button>
                        </div>
                        <span v-if="promoErrors.length > 0" class="promocode_error">{{ promoErrors[0] }}</span>
                    </div>
                </div>
                <div class="cartsum-wrapper">
                    <div class="wrapper-16">
                        <div class="cartsum">
                            <p class="cartsum__products"><span class="cartsum__products__count">{{ countProductsInCart }}</span> {{ wordEndings }} на сумму <span class="cartsum__products__price">{{ totalPrice }} руб.</span></p>
                            <p class="cartsum__discount">Скидка: <span class="cartsum__discount__amount">{{ discountPrice }} руб.</span></p>
                            <p class="cartsum__final">Итого: <span class="cartsum__final__num">{{ finalPrice }} руб.</span></p>
                        </div>
                    </div>
                </div>
                <button class="btn btn__fixed"
                        @click="toCheckout"
                >оформить заказ</button>
            </div>
        </section>
        <section class="cart-empty" v-else>
            <div class="items">
                <h2 class="done">Пусто :-(</h2>
                <div class="img">
                    <img src="../../images/like_box_empty.svg" alt="">
                </div>
                <div class="buttons">
                    <button class="btn btn-stock"
                            @click="toDiscounts"
                    >акции и скидки</button>
                    <button class="btn btn-catalog"
                            @click="toCatalog"
                    >каталог</button>
                </div>
            </div>
        </section>
        <my-modal v-show="showModal"
                  :product="currentProduct"
                  @close="showModal = false"
        ></my-modal>
    </div>
</template>
<script>
    import {wordEnds} from '../includes';
    import {mapGetters} from 'vuex';
    import {mapActions} from 'vuex';
    import myInput from './helpers/input';
    import myModal from '../components/modal';
    import {post as sendData} from "../api";

    export default {
        components: {
            myInput,
            myModal
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.loadCart();
                vm.changeTitle('КОРЗИНА');
                vm.installSwipers();
            });
        },
        data() {
          return {
              promoCode: '',
              showModal: false,
              items: [],
              currentProduct: '',
              promo: '',
              promoErrors: []
          }
        },
        computed: {
            ...mapGetters('products', {
                products: 'getItems'
            }),
            ...mapGetters('promotions', {
                actions: 'getActions',
                findPromoByName: 'getPromoByCodeName'
            }),
            ...mapGetters('cart', {
                productsInCart: 'getProducts',
                countProductsInCart: 'getCountProducts',
                totalPrice: 'cartTotalPrice',
                discountPrice: 'cartDiscountPrice',
                finalPrice: 'cartFinalPrice',
                promoApplied: 'getPromoApplyStatus',
                promoFixed: 'getPromoFixed',
                promoPercent: 'getPromoPercent'
            }),
            ...mapGetters('favorites', {
                isFavorite: 'isFavoriteItem'
            }),
            wordEndings() {
                return wordEnds(this.countProductsInCart, 'товаров', 'товар', 'товара');
            },
        },
        methods: {
            ...mapActions('cart', {
                add: 'addCartItem',
                remove: 'removeCartItem',
                removeWithAllCounts: 'removeFromCartWithAllCounts',
                loadCart: 'loadUserCart',
                changeFixedDiscount: 'setDiscountFixed',
                changePercentDiscount: 'setDiscountPercent',
                changePromoApplyStatus: 'setAppliedStatus'
            }),
            ...mapActions('favorites', {
                likeUnLike: 'addOrRemoveFavorite',
            }),
            ...mapActions('header', {
                changeTitle: 'setTitle'
            }),
            toDiscounts(){
                this.$router.push({name: 'home' });
            },
            toCatalog(){
                this.$router.push({name: 'catalog'});
            },
            toCheckout() {
                this.$auth.check() ? this.$router.push({name: 'checkout'}) : this.$router.push({ name: 'start2' });
            },
            installSwipers() {
                let products = document.querySelectorAll('.swipable');
                let likeButtons = document.querySelectorAll('.cart-item__buttons__like');
                if (products !== null) {
                    products.forEach(item => {
                        let snapper = new Snap({
                            element: item,
                            maxPosition: 56,
                            minPosition: -56,
                            hyperextensible: true,
                            minDragDistance: 25,
                            flickThreshold: 200,
                        });
                        likeButtons.forEach(item => {
                            item.addEventListener('click', () => {
                                if (snapper.state().state === 'left') {
                                    snapper.close();
                                }
                                if (snapper.state().state === 'right') {
                                    snapper.close();
                                }
                            });
                        })
                    });
                }
            },
            popModal(product) {
                this.currentProduct = product;
                this.showModal = !this.showModal;
            },
            clearPromoErrors() {
                if (this.promoErrors.length > 0) {
                    this.promoErrors = [];
                }
            },
            applyPromoCode() {
                this.promoErrors = [];
                sendData(
                    '/store/voucher',
                    {
                        voucher: this.promo
                    },
                    (data) => {
                        let promoCode = data.voucher;
                        if (promoCode.is_fixed === 1) {
                            this.changeFixedDiscount(promoCode.discount_amount);
                        }
                        else {
                            this.changePercentDiscount(promoCode.discount_amount / 100);
                        }
                        this.changePromoApplyStatus(true)
                    },
                    (error) => {
                        this.promoErrors = error.error
                    }
                );

                this.promo = '';
            }
        }
    }
</script>
