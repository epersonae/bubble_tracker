

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

	// Show newest tasks at the top

      //return Recharges.find({}, {sort: {createdAt: -1}});
      
      var chchcharges = Recharges.find({}, {sort: {createdAt: -1}});
      
      //do something to math it out here.
      
      //for each row, I want to know how many miles since the last row
      //and how many bars used since the last charge (which is USUALLY going to be 16 bars, but is it always?)
      //plus also what about some summary data? total miles driven, total KWH used, average mi/kwh, average range
        
     
      
      return chchcharges;

    },
      
        /*
        //this works for returning static variables
        chargingdata: [ 
            {totalDistance:5000, totalKWH:500, averageMPKWH:5,range:50}
        ]*/
      
    chargingdata: function() {
      
        var chchcharges = Recharges.find({}, {sort: {createdAt: -1}});
    
        var fullkwh = 16;
        
        var totalmiles = 0;
        
        /*
        chchcharges looks something like this:
        [
        {mileage: 10000, bars: 5, createdAt: 'big long date string', owner: 'somefancystring', username: 'elaine'},
        {mileage: 10100, bars: 1, createdAt: 'big long date string', owner: 'somefancystring', username: 'chad'}
        ]
        */
        
        //$.each(chchcharges,function(key,value) {
            $.each(chchcharges,function(k,v) {
                if(k == 'mileage') { totalmiles += v; };
            });
        //});
        /*_.each(chchcharges,function() {
            totalmiles += mileage;
        });*/
    
    //total distance = last mileage - first mileage
    //total KWH = sum of (foreach row, fullkwh - bars)
    //average milesPerKWH = total distance/total KWH
    //range per charge = average milesPerKWH * fullkwh
    
       // return [ {totalDistance:5000, totalKWH:500, averageMPKWH:5,range:50} ];
        
        return [ {totalDistance:totalmiles, totalKWH:500, averageMPKWH:5,range:50}];
    
        //return chargingdata;
      
  }

  });

 

  Template.body.events({

    "submit .new-recharge": function (event) {

      // Prevent default browser form submit

      event.preventDefault();

 

      // Get value from form element

      var mileage = event.target.mileage.value;
      var bars = event.target.bars.value;

 

      // Insert a task into the collection

      Meteor.call("addRecharge", mileage, bars);

 

      // Clear form

      event.target.mileage.value = "";
      event.target.bars.value = "";

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

  addRecharge: function (mileage,bars) {

    // Make sure the user is logged in before inserting a task

    if (! Meteor.userId()) {

      throw new Meteor.Error("not-authorized");

    }

 

    Recharges.insert({

      mileage: mileage,
        
        bars: bars,

      createdAt: new Date(),

      owner: Meteor.userId(),

      username: Meteor.user().username

    });

  }

});
