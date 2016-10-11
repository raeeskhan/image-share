Images = new Mongo.Collection("images");
Images.allow({
  remove:function(userId, doc){
  console.log("testing remove security");
  return true;
},
 insert:function(userId, doc){
   if(Meteor.user()){
     if(userId != doc.createdBy) {
       return false;
     }
     else {
       return true;   
     }

   }
   else {
     return false;
   }
 }

})
