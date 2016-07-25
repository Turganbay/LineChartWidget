app.directive('linearChart', function ($window, $parse) {
    return {
        restrict: "EA",
        template: "<svg></svg>",
        link: function (scope, elem, attrs) {

            var check = false,
                width = 960, height = 500,
                margin = { top: 20, right: 80, bottom: 30, left: 50 },
                innerwidth = width - margin.left - margin.right,
                innerheight = height - margin.top - margin.bottom,
                exp = $parse(attrs.chartData),
                salesDataToPlot = exp(scope),
                pathClass = "path",
                xScale, yScale, xAxisGen, yAxisGen, lineFun, x_grid, y_grid, focus;

            var d3         = $window.d3;
            var rawSvg     = elem.find("svg")[0];
            var dataGroup  = {};
            var bisectDate = d3.bisector(function (d) { return d.sales_date; }).left;
            var parseDate  = d3.time.format("%d-%b-%y");
            var customTimeFormat = d3.time.format.multi([
                  ["%I %p", function (d) { return d.getHours(); }],
                  ["%d", function (d) { return d.getDate() != 1; }],
                  ["%b %d", function (d) { return d.getDate() != 1; }],
                  ["%b", function (d) { return d.getMonth(); }],
                  ["%b", function () { return true; }]
            ]);
            
            var svg = d3.select(rawSvg)
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
           
            scope.$watchCollection(exp, function (newVal, oldVal) {
                salesDataToPlot = newVal;
                if (check) {
                    redrawLineChart();
                }
                else if( salesDataToPlot != undefined) {
                    drawLineChart();
                    check = true;
                }
            });

            // start 

            // set parameters
            function setChartParameters() {
                salesDataToPlot.forEach(function (d) {
                    d.sales_date = new Date(d.sales_date);
                    console.log(d.sales_date);
                });

                dataGroup = d3.nest()
                           .key(function (d) {
                               return d.product_id;
                           }).entries(salesDataToPlot);


                var minDate = new Date(salesDataToPlot[0].sales_date);
                var maxDate = new Date(salesDataToPlot[salesDataToPlot.length - 1].sales_date);

                xScale = d3.time.scale()
                            .range([0, innerwidth])
                            .domain([minDate, maxDate]);

                yScale = d3.scale.linear()
                           .domain([0, d3.max(salesDataToPlot, function (d) { return d.quantity; })])
                           .range([innerheight, 0]);

                x_grid = d3.svg.axis()
                           .scale(xScale)
                           .orient("bottom")
                           .tickSize(-innerheight)
                           .tickFormat("");

                y_grid = d3.svg.axis()
                           .scale(yScale)
                           .orient("left")
                           .tickSize(-innerwidth)
                           .tickFormat("");

                xAxisGen = d3.svg.axis()
                             .scale(xScale)
                             .orient("bottom")
                             .tickFormat(customTimeFormat);
                             
                yAxisGen = d3.svg.axis()
                             .scale(yScale)
                             .orient("left")
                             
                lineFun = d3.svg.line()
                            .x(function (d) { return xScale(d.sales_date); })
                            .y(function (d) { return yScale(d.quantity); });
                            
            }

            // draw line chart
            function drawLineChart()
            {
                setChartParameters();

                svg.append("g")
                   .attr("class", "x grid")
                   .attr("transform", "translate(0, " + innerheight + ")")
                   .call(x_grid);

                svg.append("g")
                    .attr("class", "y grid")
                    .call(y_grid);

                svg.append("g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0," + innerheight + ")")
                   .call(xAxisGen);

                svg.append("g")
                   .attr("class", "y axis")
                   .call(yAxisGen)
                      .append("text")
                        .attr("class", "yText")
                        .attr("transform", "rotate(-90)")   
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .text("Sales (n)");

                dataGroup.forEach(function (d, i) {
                    var color = "hsl(" + Math.random() * 360 + ",100%,50%)";
                    svg.append('svg:path')
                        .attr('d', lineFun(d.values))
                        .attr('stroke', color)
                        .attr('stroke-width', 2)
                        .attr('id', 'line_' + d.key)
                        .attr('fill', 'none')
                        .attr('class', pathClass + d.key);

                    svg.append("text")
                        .attr("transform", "translate(" + (innerwidth + 3) + "," + yScale(d.values[d.values.length - 1].quantity) + ")")
                        .attr("dy", ".35em")
                        .attr("text-anchor", "start")
                        .style("fill", color)
                        .text(d.values[0].product_name);
                });

                // interactive focus
                focus = svg.append("g").attr("class", "focus").style("display", "none");
                focus.append("circle").attr("r", 5.5);
                focus.append("circle").attr("r", 2);
                focus.append("text").attr("class", "dateLabel").attr("x", 10).attr("dy", ".35em");
                focus.append("text").attr("class", "salesLabel").attr("x", 10).attr("dy", "1.35em");
                focus.append("line").attr("id", "focusLineX").attr("class", "focusLine");

                svg.append("rect")
                    .attr("class", "overlay")
                    .attr("width", innerwidth)
                    .attr("height", innerheight)
                    .style("fill", "none")
                    .style("pointer-events", "all")
                    .on("mouseover", function () {
                        focus.style("display", null);
                    })
                    .on("mouseout", function () { focus.style("display", "none"); })
                    .on("mousemove", mousemove);
          
                // mousemove
                function mousemove() {
                    var x0 = xScale.invert(d3.mouse(this)[0]),
                        i = bisectDate(salesDataToPlot, x0, 1),
                        d0 = salesDataToPlot[i - 1],
                        d1 = salesDataToPlot[i];
                        d = x0 - d0.sales_date > d1.sales_date - x0 ? d1 : d0;
                        
                    focus.attr("transform", "translate(" + xScale(d.sales_date) + "," + yScale(d.quantity) + ")");
                    focus.select(".dateLabel").text("Date : " + parseDate(d.sales_date));
                    focus.select(".salesLabel").text("Sale : " + d.quantity);
                    focus.select("#focusLineX").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", innerheight);
                }
              
            }

            // redraw line chart by date
            function redrawLineChart() {

                setChartParameters();

                svg.selectAll("g.y.axis").call(yAxisGen);
                svg.selectAll("g.x.axis").call(xAxisGen);

                dataGroup.forEach(function (d, i) {
                    console.log(d);
                    svg.select("." + pathClass + d.key )
                        .attr('d', lineFun(d.values))
                       
                });
            }

            // end 
        }
    }
});
