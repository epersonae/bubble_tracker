

Recharges = new Mongo.Collection("recharges");

if (Meteor.isServer) {

  // This code only runs on the server

  Meteor.publish("recharges", function () {

    return Recharges.find();

  });

}

 

if (Meteor.isClient) {

  // This code only runs on the client
  
  Meteor.subscribe("recharges");

  Template.body.helpers({

    recharges: function () {
		// Show charging information in the order added
		return Recharges.find({}, {sort: {createdAt: -1}});
    },        
        
    chargingdata: function() {

		//first loop through the chargest to get the total KWH used
    	var totalKWH = 0;
		Recharges.find({}, {sort: {mileage: -1}}).forEach(function(e) {
			totalKWH += e.barsUsed;
    	});
    	
    	//then get the first and last miles recorded
    	//subtract to get total mileage
    	var firstMile = Recharges.find({}, {sort: {createdAt: 1}, limit: 1}).fetch().pop();
    	var lastMile = Recharges.find({}, {sort: {createdAt: -1}, limit: 1}).fetch().pop();
    	var totalDistance = (lastMile.mileage - firstMile.mileage);
    	
    	//average miles per KWH, rounded
    	averageMPKWH = parseInt(totalDistance/totalKWH,10);
    	
    	//range is that average times the total number of bars
    	range = averageMPKWH * 16;
    
    return [ 
            {totalDistance:totalDistance, totalKWH:totalKWH, averageMPKWH:averageMPKWH,range:range}
        ]

  }
      
    /*chargingdata: function() {
      
        var chchcharges = Recharges.find({}, {sort: {createdAt: -1}});
    
        var fullkwh = 16;
        
        var totalmiles = 0;
        
        
        
        //$.each(chchcharges,function(key,value) {
            $.each(chchcharges,function(k,v) {
                if(k == 'mileage') { totalmiles += v; };
            });
        //});
        //_.each(chchcharges,function() {
        //    totalmiles += mileage;
        //});
    
    //total distance = last mileage - first mileage
    //total KWH = sum of (foreach row, fullkwh - bars)
    //average milesPerKWH = total distance/total KWH
    //range per charge = average milesPerKWH * fullkwh
    
       // return [ {totalDistance:5000, totalKWH:500, averageMPKWH:5,range:50} ];
        
        return [ {totalDistance:totalmiles, totalKWH:500, averageMPKWH:5,range:50}];
    
        //return chargingdata;
      
  }*/

  });

 

  Template.body.events({

    "submit .new-recharge": function (event) {

      // Prevent default browser form submit

      event.preventDefault();

 

      // Get value from form element

      var mileage = event.target.mileage.value;
      var barsRemaining = event.target.barsRemaining.value;
      var barsUsed = 16 - barsRemaining;

 

      // Insert a task into the collection

      Meteor.call("addRecharge", mileage, barsRemaining, barsUsed);

 

      // Clear form

      event.target.mileage.value = "";
      event.target.barsRemaining.value = "";

    }

  });
  
  Accounts.ui.config({

    passwordSignupFields: "USERNAME_ONLY"

  });  
   

  /*Template.task.events({

    "click .toggle-checked": function () {

      // Set the checked property to the opposite of its current value

      Tasks.update(this._id, {

        $set: {checked: ! this.checked}

      });

    },

    "click .delete": function () {

      Tasks.remove(this._id);

    }

  });*/
  
  /* from Hackpad: https://meteor.hackpad.com/Meteor-Cookbook-Using-Dates-and-Times-qSQCGFc06gH#:h=4.-Formatting-Dates-for-Displa */
      Template.registerHelper("shortDate", function(date) {

        if(date)

            return date.toLocaleDateString();

    });
  

}

  Meteor.methods({

  addRecharge: function (mileage,barsRemaining,barsUsed) {

    // Make sure the user is logged in before inserting a task

    if (! Meteor.userId()) {

      throw new Meteor.Error("not-authorized");

    }

 

    Recharges.insert({

      mileage: mileage,
        
        barsRemaining: barsRemaining,
        barsUsed: barsUsed,

      createdAt: new Date(),

      owner: Meteor.userId(),

      username: Meteor.user().username

    });

  }

});
