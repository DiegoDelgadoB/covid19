$(() => {

    // Función encargada de cargar gráficos de casos covid
    const cargarGraficoTotal = (casosCovid) => {

        // Filtrar paises con más de 100.000 casos fallecidos
        const casosFiltrados = casosCovid.filter((item) => item.deaths >= 100000)

        // Crear 2 arrays para usar en los datapoints de los gráficos
        let confirmados = [];
        let fallecidos = [];


        // Recorrer la totalidad de paises con más de 100000 casos y los pasamos a los arrays antes creados
        casosFiltrados.forEach(element => {
            confirmados.push({ label: element.location, y: element.confirmed })
            fallecidos.push({ label: element.location, y: element.deaths })
        });

        var chart = new CanvasJS.Chart("graficoCovidMundial", {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Paises con covid 19"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: [{
                type: "column",
                name: "Casos confirmados",
                showInLegend: true,
                yValueFormatString: "#,##0.# Units",
                // Uso de array de casos confirmados
                dataPoints: confirmados
            },
            {
                type: "column",
                name: "Casos Fallecidos",
                showInLegend: true,
                yValueFormatString: "#,##0.# Units",
                // Uso de array de casos fallecidos
                dataPoints: fallecidos
            }]
        });
        chart.render();

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }

    }



    // Función que permite cargar las filas a la tabla
    const cargarTabla = (datos) => {
        let cuerpoTabla = document.getElementById('cuerpo-tabla');
        cuerpoTabla.innerHTML = ''


        let dataTabla = '';
        // Recorremos y acumulamos filas en una variable para posteriormente inyectarlas en el tbody
        datos.forEach((pais, index) => {
            dataTabla += `
                    <tr>
                        <th scope="row">${index + 1}</th>
                        <td>${pais.location}</td>
                        <td>${pais.confirmed}</td>
                        <td>${pais.deaths}</td>
                        <td><button type='button' class='btn btn-primary' onClick='verDetalle("${pais.location}")'>Ver detalle</button></td>
                    </tr>
            `
        })

        cuerpoTabla.innerHTML = dataTabla;

    }

    // Función que nos permite consumer el Endpoint con la totalidad de país
    const covidMundial = () => {
        const urlBase = 'http://localhost:3000/api/total';

        fetch(urlBase)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                // llamamos a métodos para cargar datos en gráfico y table
                cargarGraficoTotal(data.data);
                cargarTabla(data.data);
            })
    }


    covidMundial();


})
// Función fuera de la función ready, para tenerla disponible para el código creado dinamicamente.
const verDetalle = (dataPais) => {
    // Instancia de bootstrap para manipular el modal
    let myModal = new bootstrap.Modal(document.getElementById('modalDetalle'))
    // Petición a API por país usando el parámetro que nos envían (nombre, país)
    const urlBase = 'http://localhost:3000/api/countries/' + dataPais;
    fetch(urlBase)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            let pais = data.data;
            // Crear array para desplegar los datos en el datapoints del gráfico
            let confirmados = [{ label: pais.location, y: pais.confirmed }];
            let fallecidos = [{ label: pais.location, y: pais.deaths }];

            var chart = new CanvasJS.Chart("graficoDetalle", {
                exportEnabled: true,
                animationEnabled: true,
                title: {
                    text: `Situación Covid-19 en ${pais.location}`
                },
                axisY: {
                    title: "Casos confirmados",
                    titleFontColor: "#4F81BC",
                    lineColor: "#4F81BC",
                    labelFontColor: "#4F81BC",
                    tickColor: "#4F81BC",
                    includeZero: true
                },
                axisY2: {
                    title: "Casos fallecidos",
                    titleFontColor: "#C0504E",
                    lineColor: "#C0504E",
                    labelFontColor: "#C0504E",
                    tickColor: "#C0504E",
                    includeZero: true
                },
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    itemclick: toggleDataSeries
                },
                data: [{
                    type: "column",
                    name: "Confirmados",
                    showInLegend: true,
                    yValueFormatString: "#,##0.# Units",
                    dataPoints: confirmados
                },
                {
                    type: "column",
                    name: "Fallecidos",
                    axisYType: "secondary",
                    showInLegend: true,
                    yValueFormatString: "#,##0.# Units",
                    dataPoints: fallecidos
                }]
            });
            chart.render();

            function toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }

        })
    // mostrar modal
    myModal.toggle()


}





