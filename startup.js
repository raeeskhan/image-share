//Images = new Mongo.Collection("images");
//console.log(Images.find().count());
//import 'client/main.js';
 Meteor.startup(() => {  
  if(Images.find().count()==0) {
  for(var i=1;i<23;i++) {
  Images.insert(
   	{
	img_src:"img_"+i+".jpg",
	img_alt:"image number"+i	
	}
   );

 }
 } 
});
console.log(Images.find().count());
