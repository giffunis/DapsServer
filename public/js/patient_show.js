$(function(){
 $('#pulsar').click(function(){

   var options = {
    lines: {
      show: true
    },
    points: {
      show: true
    },
    xaxis: {
      mode: "categories",
      tickSize: 0
    }
  };

  var data = [];
  $.plot($("#activity-area-chart"), data, options);
  //  $.plot($("#activityGraphic"), data, options);

  // Fetch one series, adding to what we already have
  var alreadyFetched = {};

  var dataurl = "/activity/" + $("#activity-url").val();
  // Función que recarga el gráfico.
  function onDataReceived(series) {
    console.log("function onDataReceived");
    if (!alreadyFetched[series.label]) {
      alreadyFetched[series.label] = true;
      console.log("almacenando las series en data");
      data.push(series);
      console.log(JSON.stringify(data[0]));
    }
    $.plot($("#activity-area-chart"), data, options);
  } // onDataReceived()

   var parameters = { search: $("#activity-url").val(),
                      desde: $("#activity-calendar-desde").val(),
                      hasta: $("#activity-calendar-hasta").val()
                    };
   $.get( '/activity',parameters, function(series) {
     console.log("Datos obtenidos, llamando a onDataReceived");
     onDataReceived(series);
   }); // $.get

 });


  // callendars
  $( "#activity-calendar-desde" ).datepicker();
  $( "#activity-calendar-hasta" ).datepicker();
});
