	var myApp=angular.module('myApp',[]);

	
	myApp.directive("customDirective",function()
	{
		return {
			link: function (scope,element,attributes)
			{
				var elements= element.children().children();
				console.log(element.eq(0).addClass('event_style'));	
			},
			replace: true,
			restrict: "EACM"
		}
	});

	myApp.filter("isTickets", function()
	{
		
		return function(matches){
		//	console.log(matches);
			for(var i=0;i<matches.length;i++)
			{
				if(matches[i].tickets_left==0)
				{
					console.log(" matches " + matches[i]);
					var elem=document.getElementById(matches[i].event_id);
					elem.style.color="gray";
					matches[i].display_form=false;		
				}
			}
			return matches;
		}
	});

	myApp.controller('mainController',function($scope,$http,$timeout)
	{
		$http.get('tickets.json')

		.success(function(result)
		{
			$scope.tickets=result;
			console.log("Its OK!");
		})

		.error(function(data,status)
		{
			console.log("Error!!!Problems with loading data");
			console.log(data);
			console.log(status);
		});

		//С‚СЂРµР±Р° РІРёРєР»РёРєР°С‚Рё РєРѕР»Рё Р·Р°РіСЂСѓР·РёС‚СЃСЏ РґРѕРєСѓРјРµРЅС‚
		$scope.makeCategoryId=function()
		{
			var elements = document.getElementsByName('list-categories');
			console.log(elements);
			for(var i=0;i<elements.length;i++)
			{
				elements[i].id=$scope.tickets.allCategories[i].category_id;
			}

		};

		$scope.makeEventId=function()
		{
			var elements = document.getElementsByName('list-events');
			var t=0;
			for(var j=0;j<$scope.tickets.allCategories.length;j++)
				for(var i=0;i<$scope.tickets.allCategories[j].events.length;i++)
				{
					elements[t].id=$scope.tickets.allCategories[j].events[i].events_id;
					console.log(elements[t].id);
					t++;
				}
		};

		$scope.makeMatchId=function()
		{
			var t=0;
			var elements = document.getElementsByName('list-matches');
			for(var j = 0; j < $scope.tickets.allCategories.length; j++)
				for(var i = 0;i < $scope.tickets.allCategories[j].events.length; i++)
					for (var k = 0; k < $scope.tickets.allCategories[j].events[i].matches.length; k++) 
					{
						elements[t].id=$scope.tickets.allCategories[j].events[i].matches[k].event_id;
						t++;
					}
		};

		$scope.showEvents=function(evt)
		{
			$scope.makeCategoryId();
			$scope.makeEventId();
			$scope.makeMatchId();
			console.log(" evt " +evt);
			setFormId();
			//для показування і скривання подій, матчів та форм
			Events(evt);
			$scope.ticketsTimer();
			
		};
	
		$scope.flag=false;
		
		function Events(evt)
		{
			for(var i=0;i<$scope.tickets.allCategories[evt.t.category_id-1].events.length;i++)
			{
				if($scope.tickets.allCategories[evt.t.category_id-1].events[i].display_event==true)
				{
					$scope.flag=true;
					break;
				}
				else $scope.flag=false;
			}
			
			if(!$scope.flag)
			{
				for(var i=0;i<$scope.tickets.allCategories[evt.t.category_id-1].events.length;i++)
				{
					$scope.tickets.allCategories[evt.t.category_id-1].events[i].display_event=true;
					
				}
			}
			else
			{
				for(var i=0;i<$scope.tickets.allCategories[evt.t.category_id-1].events.length;i++)
				{
					$scope.tickets.allCategories[evt.t.category_id-1].events[i].display_event=false;

					for(var j=0;j<$scope.tickets.allCategories[evt.t.category_id-1].events[i].matches.length;j++)
					{
						$scope.tickets.allCategories[evt.t.category_id-1].events[i].matches[j].display_form=false;
						$scope.tickets.allCategories[evt.t.category_id-1].events[i].matches[j].match_display=false;
					}
				}
			}
			console.log($scope.flag);

		};

	
		$scope.showMatches=function(tic,event)
		{
			console.log(tic);
			console.log(event);		
			console.log(event.ev.events_id);
			console.log("Event");
			//alert($scope.tickets.allCategories[tic.category_id-1].events[event.ev.events_id].matches.length);
			for(var i=0;i<$scope.tickets.allCategories[tic.category_id-1].events[event.ev.events_id-(tic.category_id*10+1)].matches.length;i++)
			{
				$scope.tickets.allCategories[tic.category_id-1].events[event.ev.events_id-(tic.category_id*10+1)].matches[i].match_display=!$scope.tickets.allCategories[tic.category_id-1].events[event.ev.events_id-(tic.category_id*10+1)].matches[i].match_display;
				
			}
			
		};
		
		$scope.ticketsTimer=function()
		{	
			var time=$timeout($scope.ticketsTimer,1000);
			for (var i = 0; i <$scope.tickets.allCategories.length; i++) 
			{
				for (var j = 0; j <$scope.tickets.allCategories[i].events.length; j++) 
				{
					for (var k = 0; k <$scope.tickets.allCategories[i].events[j].matches.length; k++) 
					{
						var temp=~~(Math.random()*8);						
						if(($scope.tickets.allCategories[i].events[j].matches[k].tickets_left-temp)>=0)
						{
							$scope.tickets.allCategories[i].events[j].matches[k].tickets_left-=temp;
						}
					}
				}					
			}
		};
		
		
		$scope.showForm=function(th)
		{
			th.display_form=!th.display_form;
		};
		
		var setFormId=function()
		{
			var t=0;
			var elements=document.getElementsByName('myForm');
			console.log(elements.length);
			/*
			якщо через фільтр
			for (var k = 0; k <(getMatches(events.events_id,true)).length; k++) 
			{
				if(elements.length<t)
					return;
				elements[t].id=(getMatches(events.events_id,true))[k].event_id;
				t++;
			}
			*/
			//якщо через ng-show
			for (var i = 0; i < $scope.tickets.allCategories.length; i++)
			{
				for (var j = 0; j < $scope.tickets.allCategories[i].events.length; j++) 
				{
					for (var k = 0; k < $scope.tickets.allCategories[i].events[j].matches.length; k++) 
					{
						// у форми немає власного ідентифікатора, але в кожного матча лише одна форма
						//тому берем його ідентифікатор і збільшуєм на константу
						elements[t].id=$scope.tickets.allCategories[i].events[j].matches[k].event_id*10;
						t++;
					}
				}
			}
		};

		$scope.temp=0;

		$scope.buyTickets=function(user,matches,events,categories){
			console.log(user);
			console.log(matches);
			console.log(events);
			console.log(categories);
	
			var elem=document.getElementById(matches.event_id*10);
			console.log(elem);
			
			//якщо все вірно введено
			if(isCorrectPhone(elem.phone.value)&&isCorrectTicketsNumber(user.tickets,matches,events,categories))
			{
				//кількість квитків які залишилися відняти кількість квитків які бажає користувач
				$scope.tickets.allCategories[categories.category_id-1].events[events.events_id-
				(categories.category_id*10)-1].matches[matches.event_id-(events.events_id*10)-1].tickets_left-=user.tickets;
				elem.name.style.backgroundColor='lightgreen';
				elem.phone.style.backgroundColor='lightgreen';
				elem.numberTickets.style.backgroundColor='lightgreen';
				alert("Successful operation!");
			}
			else
			{
				alert("some mistakes!!");
				elem.name.style.backgroundColor='lightgreen';
				if(isCorrectPhone(elem.phone.value))
				{
					elem.phone.style.backgroundColor='lightgreen';
				}
				else
				{
					elem.phone.style.backgroundColor='pink';
				}
				if(isCorrectTicketsNumber(user.tickets,matches,events,categories))
				{
					elem.numberTickets.style.backgroundColor='lightgreen';
				}
				else
				{
					alert("Cant buy so much tickets");
					elem.numberTickets.style.backgroundColor='pink';
				}
			}
		};

		var isCorrectTicketsNumber=function(tickets,matches,events,categories)
		{
			if(tickets==undefined)
				return false;
			var temp=$scope.tickets.allCategories[categories.category_id-1].events[events.events_id-(categories.category_id*10)-1]
			.matches[matches.event_id-(events.events_id*10)-1].tickets_left-tickets;
			if(temp>0)
				return true;
			return false;
	
		}

		var isCorrectPhone=function(number)
		{
			if(number==undefined)
				return false;
			if((number>380000000000 && number<380999999999)||(number>99999999 && number<0999999999))
				return true;
		
			return false;
		};

		var getMatches=function(match,array)
		{
			array=array||false;
			if(array&&match>100)
				return $scope.tickets.allCategories[~~((match/100) - 1)].events[~~((match%100)/10 - 1)].matches;
			
			else if(array&&match>10)
				return $scope.tickets.allCategories[~~((match/10) - 1)].events[~~((match%10) - 1)].matches;
			
			else if(match>100)
					return $scope.tickets.allCategories[~~((match/100) - 1)].events[~~((match%100)/10 - 1)].matches[~~(((match%100)%10) - 1)];

		};

		var getEvent=function(temp)
		{
			if(temp<100&&temp>10)
				return $scope.tickets.allCategories[~~(temp/10 - 1)].events[~~((temp%10) - 1)];	

			if(temp>100)
				return $scope.tickets.allCategories[~~(temp/100 - 1)].events[~~((temp%100)/10 - 1)];
		};

		$scope.Display=function(match)
		{
			return getMatches(match.event_id).match_display && getEvent(match.event_id).display_event;
		};
	});


	
