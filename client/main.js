//Images = new Mongo.Collection("images");
//console.log(Images.find().count());
import { Session } from 'meteor/session'

//Routing
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});
Router.route('/', function () {
  this.render("welcome", {
    to:"main"
  });

});
Router.route('/images', function () {
  this.render("navbar", {
    to:"navbar"
  });
  this.render("images", {
    to:"main"
  });
});
Router.route('/image/:_id', function () {
  this.render("navbar", {
    to:"navbar"
  });
  this.render("image", {
    to:"main",
    data:function(){
      return Images.findOne({_id:this.params._id});
    }
  });
});


Session.set("imageLimit", 8);
lastScrollTop = 0;
  $(window).scroll(function(){
   if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    var scrollTop = $(this).scrollTop();
    if(scrollTop > lastScrollTop) {
    console.log(new Date());
    }
  lastScrollTop = scrollTop;
  Session.set("imageLimit", Session.get("imageLimit")+4);
  }
  });
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"

  });
  Template.images.helpers({
    images:function() {
      if(Session.get("userFilter")) {
      console.log(Session.get("userFilter"));
      return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn:-1,rating:-1}});

      }
else {
return Images.find({}, {sort:{createdOn:-1,rating:-1}, limit:Session.get("imageLimit")});
}
  },
   image_fitering:function() {
     if(Session.get("userFilter")) {
       return true;
     }
     else {
       return flase;
     }
   },
    getUser:function(user_id) {
      var user = Meteor.users.findOne({_id:user_id});
      if(user) {
        return user.username;
      }
      else {
        return "annony";
      }
    },
    getFilterUser:function(){
      if(Session.get("userFilter")) {
        var user = Meteor.users.findOne({_id:Session.get("userFilter")});
        return user.username;
      }

    }
  });
  Template.body.helpers({username:function(){
    if(Meteor.user()) {
    //return Meteor.user().emails[0].address;
return Meteor.user().username;
   }
   else {
     return "Guest";
   }
  }});
  Template.images.events({
	'click .js-image':function(event){
 	 $(event.target).css("width","50px");
	},
     'click .js-del-image':function(event){
	 var img_id = this._id;
	 console.log(img_id);

	 $("#"+img_id).hide('slow', function(){
	   Images.remove({"_id":img_id});
	  });
	},
      'click .js-rate-image':function(event) {
	var rating = $(event.currentTarget).data("userrating");
		console.log(rating);
		var image_id = this.id;
		console.log(image_id);
		Images.update({_id:image_id},{$set: {rating:rating}});
	},
     'click .js-show-form':function(event){
	$("#image_form").modal('show');
	},
  'click .js-set-image-filter':function(event) {
    if(Session.set("userFilter", this.createdBy))
    console.log(userFilter);
  },
  'click .js-unset-image-filter':function(event) {
    Session.set("userFilter", undefined);
  },
	});

Template.image_form.events({
'submit .js-add-image':function(event){
var img_src, img_alt;
img_src = event.target.img_src.value;
img_alt = event.target.img_alt.value;
console.log("src: "+img_src+" alt: "+img_alt);
if(Meteor.user()) {
Images.insert({
img_src:img_src,
img_alt:img_alt,
createdOn:new Date(),
createdBy:Meteor.user()._id
});
}
return false;
},
});
