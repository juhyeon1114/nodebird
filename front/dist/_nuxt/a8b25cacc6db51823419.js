(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{270:function(t,e,o){},271:function(t,e,o){},272:function(t,e,o){},275:function(t,e,o){"use strict";var n=o(270);o.n(n).a},276:function(t,e,o){"use strict";var n=o(271);o.n(n).a},277:function(t,e,o){"use strict";var n=o(272);o.n(n).a},278:function(t,e,o){"use strict";o(95);var n={props:{postId:{type:String,required:!0}},data:function(){return{valid:!1,content:"",success:!1,successMessages:"",hideDetails:!0}},computed:{me:function(){return this.$store.state.users.me}},methods:{onChangeTextarea:function(t){t.length&&(this.hideDetails=!0,this.success=!1,this.successMessages="")},onSubmitForm:function(){var t=this;this.$refs.form.validate()&&this.$store.dispatch("posts/addComment",{postId:this.postId,content:this.content}).then((function(){t.content="",t.success=!0,t.successMessages="댓글이 작성되었습니다.",t.hideDetails=!1})).catch((function(){}))}}},r=o(28),c=o(69),l=o.n(c),m=o(257),d=o(263),v=o(304),component=Object(r.a)(n,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-form",{ref:"form",staticStyle:{position:"relative"},on:{submit:function(e){return e.preventDefault(),t.onSubmitForm(e)}},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[o("v-textarea",{attrs:{filled:"",label:"댓글 달기","hide-details":t.hideDetails,success:t.success,"success-messages":t.successMessages},on:{input:t.onChangeTextarea},model:{value:t.content,callback:function(e){t.content=e},expression:"content"}}),t._v(" "),o("v-btn",{attrs:{color:"green",dark:"",absolute:"",top:"",right:"",type:"submit"}},[t._v("댓글")])],1)}),[],!1,null,null,null),h=component.exports;l()(component,{VBtn:m.a,VForm:d.a,VTextarea:v.a});o(47);var f={props:{images:{type:Array,required:!0},closeModal:{type:Function,required:!0}}},_=(o(275),o(312)),k=o(313),I=o(115),y=o(168),x=o(54),w=Object(r.a)(f,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"image-zoom"}},[e("header",[e("h1",[this._v("상세 이미지")]),this._v(" "),e("v-icon",{attrs:{color:"red",id:"close-btn"},on:{click:this.closeModal}},[this._v("mid-close")])],1),this._v(" "),e("div",{attrs:{id:"carousel-wrapper"}},[e("v-carousel",this._l(this.images,(function(img){return e("v-carousel-item",{key:img.src},[e("v-sheet",[e("v-img",{attrs:{"max-height":"500",contain:"",src:img.src}})],1)],1)})),1)],1)])}),[],!1,null,null,null),V=w.exports;l()(w,{VCarousel:_.a,VCarouselItem:k.a,VIcon:I.a,VImg:y.a,VSheet:x.a});var $={components:{ImageZoom:V},props:{images:{type:Array,required:!0}},data:function(){return{imageZoomed:!1}},methods:{closeModal:function(){this.imageZoomed=!1},zoomImages:function(){this.imageZoomed=!0}}},C=Object(r.a)($,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return 0===t.images.length?o("div"):1===t.images.length?o("div",{staticStyle:{display:"flex"}},[o("v-img",{attrs:{src:"http://localhost:3085/"+t.images[0].src,contain:"","aspect-ratio":"2"},on:{click:t.zoomImages}}),t._v(" "),t.imageZoomed?o("image-zoom",{attrs:{"close-modal":t.closeModal,images:t.images}}):t._e()],1):2===t.images.length?o("div",{staticStyle:{display:"flex"}},[o("v-img",{staticStyle:{flex:"1"},attrs:{src:"http://localhost:3085/"+t.images[0].src,contain:"","aspect-ratio":"2"},on:{click:t.zoomImages}}),t._v(" "),o("v-img",{staticStyle:{flex:"1"},attrs:{src:"http://localhost:3085/"+t.images[1].src,contain:"","aspect-ratio":"2"},on:{click:t.zoomImages}}),t._v(" "),t.imageZoomed?o("image-zoom",{attrs:{"close-modal":t.closeModal,images:t.images}}):t._e()],1):t.images.length>2?o("div",{staticStyle:{display:"flex"}},[o("v-img",{staticStyle:{flex:"1"},attrs:{src:"http://localhost:3085/"+t.images[0].src,contain:"","aspect-ratio":"2"},on:{click:t.zoomImages}}),t._v(" "),o("div",{staticStyle:{flex:"1","align-items":"center","justify-content":"center",display:"flex"},on:{click:t.zoomImages}},[o("div",{staticStyle:{"text-align":"center"}},[o("v-icon",[t._v("mdi-dots-horizontal")]),t._v(" "),o("div",[t._v("더보기")])],1)]),t._v(" "),t.imageZoomed?o("image-zoom",{attrs:{"close-modal":t.closeModal,images:t.images}}):t._e()],1):t._e()}),[],!1,null,"2763aa26",null),S=C.exports;l()(C,{VIcon:I.a,VImg:y.a});var U={components:{PostImages:S},props:{post:{type:Object}},computed:{nodes:function(){return this.post.content.split(/(#[^\s#]+)/)},me:function(){return this.$store.state.users.me},canFollow:function(){var t=this;return this.me&&this.post.User.id!==this.me.id&&!this.me.Followings.find((function(e){return e.id===t.post.User.id}))},canUnfollow:function(){var t=this;return this.me&&this.post.User.id!==this.me.id&&this.me.Followings.find((function(e){return e.id===t.post.User.id}))}},methods:{onFollow:function(){this.$store.dispatch("users/follow",{userId:this.post.User.id})},onUnfollow:function(){this.$store.dispatch("users/unfollow",{userId:this.post.User.id})}}},O=(o(276),o(255)),z=Object(r.a)(U,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("post-images",{attrs:{images:t.post.Images||[]}}),t._v(" "),o("v-card-title",[o("h3",[o("nuxt-link",{attrs:{to:"/user/"+t.post.User.id}},[t._v(t._s(t.post.User.nickname))]),t._v(" "),t.canFollow?o("v-btn",{on:{click:t.onFollow}},[t._v("팔로우")]):t._e(),t._v(" "),t.canUnfollow?o("v-btn",{on:{click:t.onUnfollow}},[t._v("언팔로우")]):t._e()],1)]),t._v(" "),o("v-card-text",[o("div",[t._l(t.nodes,(function(e,i){return[e.startsWith("#")?o("nuxt-link",{key:i,attrs:{to:"/hashtag/"+e.slice(1)}},[t._v(t._s(e))]):[t._v(t._s(e))]]}))],2),t._v(" "),o("div",[t._v(t._s(t.$moment(t.post.createdAt).fromNow()))])])],1)}),[],!1,null,"3b03dc6b",null),F=z.exports;l()(z,{VBtn:m.a,VCardText:O.b,VCardTitle:O.c});var M={components:{CommentForm:h,PostContent:F},data:function(){return{commentOpened:!1}},props:{post:{type:Object,required:!0}},computed:{me:function(){return this.$store.state.users.me},liked:function(){var t=this;return!!(this.post.Likers||[]).find((function(e){return e.id===(t.me&&t.me.id)}))},heartIcon:function(){return this.liked?"mdi-heart":"mdi-heart-outline"}},methods:{onRemovePost:function(){this.$store.dispatch("posts/remove",{postId:this.post.id})},onRetweet:function(){if(!this.me)return alert("로그인이 필요합니다.");this.$store.dispatch("posts/retweet",{postId:this.post.id})},onClickHeart:function(){return this.me?this.liked?this.$store.dispatch("posts/unlikePost",{postId:this.post.id}):this.$store.dispatch("posts/likePost",{postId:this.post.id}):alert("로그인이 필요합니다.")},onEditPost:function(){},onToggleComment:function(){this.commentOpened||this.$store.dispatch("posts/loadComments",{postId:this.post.id}),this.commentOpened=!this.commentOpened}}},P=(o(277),o(256)),j=o(286),E=o(282),T=o(289),L=o(269),R=o(305),Z=o(296),A=Object(r.a)(M,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticStyle:{"margin-bottom":"20px"}},[o("v-card",[t.post.RetweetId&&t.post.Retweet?o("div",[o("v-subheader",[t._v(t._s(t.post.User.nickname)+"님이 리트윗하셨습니다.")]),t._v(" "),o("v-card",{staticStyle:{margin:"0 20px"}},[o("post-content",{attrs:{post:t.post.Retweet}})],1)],1):o("post-content",{attrs:{post:t.post}}),t._v(" "),o("v-card-actions",[o("v-btn",{attrs:{text:"",color:"orange"},on:{click:t.onRetweet}},[o("v-icon",[t._v("mdi-twitter-retweet")])],1),t._v(" "),o("v-btn",{attrs:{text:"",color:"orange"},on:{click:t.onClickHeart}},[o("v-icon",[t._v(t._s(t.heartIcon))])],1),t._v(" "),o("v-btn",{attrs:{text:"",color:"orange"},on:{click:t.onToggleComment}},[o("v-icon",[t._v("mdi-comment-outline")])],1),t._v(" "),o("v-menu",{attrs:{"offset-y":"","open-on-hover":""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on;return[o("v-btn",t._g({attrs:{text:"",color:"orange"}},n),[o("v-icon",[t._v("mdi-dots-horizontal")])],1)]}}])},[t._v(" "),o("div",{staticStyle:{background:"white"}},[o("v-btn",{attrs:{dark:"",color:"red"},on:{click:t.onRemovePost}},[t._v("삭제")]),t._v(" "),o("v-btn",{attrs:{text:"",color:"orange"},on:{click:t.onEditPost}},[t._v("수정")])],1)])],1)],1),t._v(" "),t.commentOpened?[o("comment-form",{attrs:{"post-id":t.post.id}}),t._v(" "),o("v-list",t._l(t.post.Comments,(function(e){return o("v-list-item",{key:e.id},[o("v-list-item-avatar",{attrs:{color:"teal"}},[o("span",[t._v(t._s(e.User.nickname[0]))])]),t._v(" "),o("v-list-item-content",[o("v-list-item-title",[t._v(t._s(e.User.nickname))]),t._v(" "),o("v-list-item-subtitle",[t._v(t._s(e.content))])],1)],1)})),1)]:t._e()],2)}),[],!1,null,"f1269b40",null);e.a=A.exports;l()(A,{VBtn:m.a,VCard:P.a,VCardActions:O.a,VIcon:I.a,VList:j.a,VListItem:E.a,VListItemAvatar:T.a,VListItemContent:L.a,VListItemSubtitle:L.b,VListItemTitle:L.c,VMenu:R.a,VSubheader:Z.a})},311:function(t,e,o){"use strict";o.r(e);o(95);var n={components:{PostCard:o(278).a},computed:{post:function(){var t=this;return this.$store.state.posts.mainPosts.find((function(e){return e.id===parseInt(t.$route.params.id,10)}))}},fetch:function(t){var e=t.store,o=t.params;return e.dispatch("posts/loadPost",o.id)},head:function(){return{title:"".concat(this.post.User.nickname,"님의 게시글"),meta:[{hid:"desc",name:"description",content:this.post.content},{hid:"ogtitle",property:"og:title",content:"".concat(this.post.User.nickname,"님의 게시글")},{hid:"ogdesc",property:"og:description",content:this.post.content},{hid:"ogimage",property:"og:image",content:this.post.Images[0]?this.post.Images[0].src:"https://vue.nodebird.com/vue-nodebird.png"},{hid:"ogurl",property:"og:url",content:"https://vue.nodebird.com/post/".concat(this.post.id)}]}}},r=o(28),c=o(69),l=o.n(c),m=o(268),component=Object(r.a)(n,(function(){var t=this.$createElement,e=this._self._c||t;return this.post?e("v-container",[e("post-card",{attrs:{post:this.post}})],1):e("div",[this._v("\n    게시글이 존재하지 않습니다.\n")])}),[],!1,null,null,null);e.default=component.exports;l()(component,{VContainer:m.a})}}]);