    angular.module('myApp',['ngRoute'])

    .filter('isTickets',function()
    {
        return function(match)
        {
           console.log("match",match);

           for(var i=0;i<match.length;i++)
           {
                if(match[i].tickets_left==0)
                    match[i].match_display=false;
                else
                    match[i].match_display=true;
           }         
           return match;
        }
    })

    .directive('myForm',function()
    {
        
            templateUrl: 'myForm.html'
        
    })

    .config(function($routeProvider)
    {
         $routeProvider

         .when('/',
         {
            templateUrl: 'category.html'
         })

         .when('/:category',
         {
            templateUrl: 'event.html',
            controller: 'mainController'
         })

         .when('/:category/:event',
         {
            templateUrl: 'match.html',
            controller: 'mainController'
         })

         .when('/:category/:event/:match',
         {
            templateUrl: 'form.html',
            controller: 'mainController'
         })

        .otherwise(
        {
            template:'<h1>404 no such page</h1>'
        })
    })
  
    .controller('mainController',function($scope,$http,$routeParams,$timeout,$window)
    {
        $http.get('tickets.json')

        .success(function(result)
        {
            $scope.tickets=result;
            console.log("Ajax connected!!");
        })

        .error(function(data,status)
        {
            console.log('Ajax failed!');
            console.log(data);
            console.log(status);
        });

        console.log($routeParams);

        $scope.getCategory=function()
        { 
            if(!$routeParams.category)
                return;
           
            $scope.current_category=_.find($scope.tickets.allCategories,function (cat)
            {
                if($routeParams.category==cat.category)
                    return true;
            });
       };

        $scope.getEvent=function()
        {
            if(!$routeParams.event||!$scope.current_category)
                return;

            $scope.current_event=_.find($scope.current_category.events,function(event)
            {
                if($routeParams.event==event.name)
                    return true;
            });         
        };

        $scope.getMatch=function()
        {        
            console.log("getMatch");
            console.log($routeParams.match);
            console.log($scope.current_category);
            console.log($scope.current_event);

            if(!$routeParams.match||! $scope.current_event)
                return;
            
                $scope.current_match=_.find($scope.current_event.matches,function(match)
                {
                    if($routeParams.match==match.name_matches)
                        return true;
                });
        };
   
        $scope.getCategory();
        $scope.getEvent();
        $scope.getMatch();

        $scope.buyTickets=function(User)
        {
            var fl=0;
            var form=document.getElementById('form');
              
            var temp = $scope.current_match.tickets_left-User.tickets;
            var phone_number= String(User.phone).match(/\d/g);
           
            if(temp>=0)
            {
               form.numberTickets.style.backgroundColor='lightgreen';
            }
            else
            {
                form.numberTickets.style.backgroundColor='pink';
                alert("Cant buy so much tickets!");
                fl=1;
            }
           
            if(phone_number==null)
            {
                form.phone.style.backgroundColor='pink';
                alert("Enter correct phone number!!");
                fl=1;
            }
            else if(phone_number.length==9||phone_number.length==12)
            {
                form.phone.style.backgroundColor='lightgreen';
            }
            else
            {
                form.phone.style.backgroundColor='pink';
                alert("Enter correct phone number!!");
                fl=1;
            }
        
            if(fl)
                return;

            $scope.current_match.tickets_left=temp;
            alert("Successfull operation!");

        };

        $scope.ticketsTimer=function()
        {   
            var time=$timeout($scope.ticketsTimer,1000);
            for (var i = 0; i <$scope.tickets.allCategories.length; i++) 
                for (var j = 0; j <$scope.tickets.allCategories[i].events.length; j++) 
                    for (var k = 0; k <$scope.tickets.allCategories[i].events[j].matches.length; k++) 
                    {
                        var temp=~~(Math.random()*8);                       
    
                        if(($scope.tickets.allCategories[i].events[j].matches[k].tickets_left-temp)>=0)
                            $scope.tickets.allCategories[i].events[j].matches[k].tickets_left-=temp;
                    }
        };

        $window.onload=function()
        {
           $scope.ticketsTimer();
        };

    });

   