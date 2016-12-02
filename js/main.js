(function() {
  'use strict'

  var x_scale_stacked_bar;

  var color = new Object();
  color['Intel'] = '#2bacfb';
  color['AMD'] = '#f44d29';
  color['NVIDIA'] = '#31d620',
    color['Win_7'] = '#fd9213',
    color['Win_10'] = '#fdb813',
    color['Win_XP'] = '#fdd413',
    color['Win_8-1'] = '#fdf513',
    color['OS_X'] = '#75cbff',
    color['Other'] = '#454545',
    color['Has_Flash'] = '#b4b4b4',
    color['No_Flash'] = '#f1f1f1';

  var global = {
    heroIndex: 0,
    chart: {
      width: 400,
      height: 660,
      left: 0,
      right: 120,
      xax_count: 4
    },
    gpu_model_nice: {
      'gpu_model_gen7.5-haswell-gt2': 'Haswell (GT2)',
      'gpu_model_gen7-ivybridge-gt2': 'Ivy Bridge (GT2)',
      'gpu_model_gen6-sandybridge-gt2': 'Sandy Bridge (GT2)',
      'gpu_model_gen6-sandybridge-gt1': 'Sandy Bridge (GT1)',
      'gpu_model_gen7-ivybridge-gt1': 'Ivy Bridge (GT1)',
      'gpu_model_gen4.5-gma4500hd': 'GMA 4500HD',
      'gpu_model_gen5-ironlake': 'Ironlake',
      'gpu_model_gen7-baytrail': 'Bay Trail',
      'gpu_model_gen4.5-gma4500': 'GMA 4500',
      'gpu_model_gen8-broadwell-gt2': 'Broadwell (GT2)',
      'gpu_model_gen3-gma3100': 'GMA 3100',
      'gpu_model_gen3-gma950': 'GMA 950',
      'gpu_model_gen7.5-haswell-gt21': 'Haswell (GT21)',
      'gpu_model_gen7-ivybridge-gt22': 'Ivy Bridge (GT22)',
      'gpu_model_gen6-sandybridge-gt23': 'Sandy Bridge (GT23)',
      'gpu_model_gen6-sandybridge-gt14': 'Sandy Bridge (GT14)',
      'gpu_model_gen7-ivybridge-gt15': 'Sandy Bridge (GT15)',
      'gpu_model_gen4.5-gma4500hd6': 'GMA 4500HD 6',
      'gpu_model_gen5-ironlake7': 'Ironlake',
      'gpu_model_gen7-baytrail8': 'Bay Trail 8',
      'gpu_model_gen4.5-gma45009': 'GMA 4500 9',
      'gpu_model_gen8-broadwell-gt210': 'Broadwell (GT 210)',
      'gpu_model_gen3-gma310011': 'GMA 310011',
      'gpu_model_EVERGREEN-PALM': 'Evergreen (Palm)†',
      'gpu_model_gen9-skylake-gt2': 'Skylake (GT2)',
      'gpu_model_EVERGREEN-CEDAR': 'Evergreen (Cedar)†',
      'gpu_model_CAYMAN-ARUBA': 'Cayman (Aruba)†',
      'gpu_model_gen4-gma3500': 'GMA 3500',
      'gpu_model_Tesla-GT218': 'GeForce GT218*',
      'gpu_model_NV40-C61': 'GeForce NV40*',
      'gpu_model_gen7.5-haswell-gt3': 'Haswell (GT3)',
      'gpu_model_gen7.5-haswell-gt1': 'Haswell (GT1)',
      'gpu_model_EVERGREEN-TURKS': 'Evergreen (Turks)†'
    }
  };

  var mouseover = function(target) {
    return function() {
      //reduce opacity of all other lines but this one
      var hiding_these = '';
      var r = /\d+/;

      d3.selectAll(target + ' .mg-line-rollover-circle').nodes().forEach(
        function(d) {
          if (d3.select(d).style('opacity') === '0' || d3.select(d).attr(
            'r') === '0') {
            var line_id = d.classList[0].match(r);
            hiding_these += 'path.mg-line' + line_id + ',';
            hiding_these += '.mg-line-legend .mg-line' + line_id +
              '-legend-color,';
          }
        });

      d3.select(target).selectAll(hiding_these.slice(0, -1))
        .style('opacity', '0.3');

      //update color of hover text with vendor color if applicable
      d3.select(target).selectAll('.mg-active-datapoint tspan tspan')
        .style('fill', 'white');
    }
  }

  var mouseout = function(target) {
    return function() {
      d3.select(target).selectAll('path, .mg-line-legend text')
        .style('opacity', '1');
    }
  }

  // on category click
  //     d3.selectAll('.category')
  //       .on('click', function() {
  //         d3.event.preventDefault();
  // 
  //         var section = d3.select(this).attr('href').slice(6);
  //         document.location.hash = section;
  // 
  //         //hide hero charts
  //         // d3.selectAll('.hero, .hero-controls-bar')
  // //           .style('display', 'none');
  //         
  //         //show detail charts
  //         reorderCharts(section);
  // 
  //         return false;
  //     });

  function reorderCharts(section) {
    if (section == 'all') {
      d3.selectAll('.chart').style('display', 'block');
      return;
    }

    d3.selectAll('.chart')
      .style('display', 'none');

    d3.selectAll('.chart.' + section)
      .style('display', 'block');
  }

  function drawHeroCharts(data_this_month) {
    var data_cpu = [{
      key: 'Intel',
      value: data_this_month.cpu_GenuineIntel
    }, {
      key: 'AMD',
      value: data_this_month.cpu_AuthenticAMD
    }];
    heroChart(data_cpu, '#processor');

    var data_gpu = [{
      key: 'Intel',
      value: data_this_month.gpu_Intel
    }, {
      key: 'AMD',
      value: data_this_month.gpu_AMD
    }, {
      key: 'NVIDIA',
      value: data_this_month.gpu_NVIDIA
    }];
    heroChart(data_gpu, '#pc-video-card');

    var data_os = [{
      key: 'Win_7',
      value: data_this_month['os_Windows_NT-6.1']
    }, {
      key: 'Win_10',
      value: data_this_month['os_Windows_NT-10.0']
    }, {
      key: 'Win_XP',
      value: data_this_month['os_Windows_NT-5.1']
    }, {
      key: 'Win_8-1',
      value: data_this_month['os_Windows_NT-6.3']
    }, {
      key: 'OS_X',
      value: data_this_month['os_Darwin']
    }];
    heroChart(data_os, '#operating-systems');

    var data_flash = [{
      key: 'Has_Flash',
      value: data_this_month.has_flash_True
    }, {
      key: 'No_Flash',
      value: data_this_month.has_flash_False
    }];
    heroChart(data_flash, '#flash');
  }

  function heroChart(data, target) {
    //do we need an 'Other' property?
    var sum = 0;
    data.forEach(function(d) {
      sum += d.value;
    });

    if (sum < 1) {
      data.push({
        key: 'Other',
        value: 1 - sum
      });
    }

    var width = 450,
      height = 90,
      x_padding_left = 0,
      x_padding_right = 30,
      bar_y_position = 15,
      bar_height = 22;

    x_scale_stacked_bar = d3.scaleLinear()
      .domain([0, 1])
      .range([0, width - x_padding_right]);

    var svg = d3.select(target).select('svg');
    var rects = svg.selectAll('rect.bar');
    var x_marker = 0;


    var formatter = d3.timeFormat("%b %d, %Y");
    d3.select('.formatted-date').html(formatter(global.data[global.heroIndex]
      .date));

    //updating?
    if (rects.nodes().length > 0) {
      rects.data(data)
        .transition()
        .duration(500)
        .attr('width', function(d) {
          return (d.value == undefined) ? x_scale_stacked_bar(0) :
            x_scale_stacked_bar(d.value).toFixed(1);
        })
        .attr('x', function(d) {
          if (d.value == undefined) d.value = 0;

          var x_marker_this = x_marker;
          x_marker += d.value;

          //append circle
          svg.select('circle.tippy_' + d.key)
            .attr('cx', function() {
              return x_padding_left + x_scale_stacked_bar(
                x_marker_this + ((x_marker - x_marker_this) / 2));
            })
            .attr('cy', bar_y_position + bar_height - 3);

          //append text labels
          svg.select('text.tippytext_' + d.key)
            .attr('x', function() {
              return x_padding_left + x_scale_stacked_bar(
                x_marker_this + ((x_marker - x_marker_this) / 2));
            })
            .attr('y', function() {
              return bar_y_position + bar_height + 22;
            })
            .text(function() {
              var label = d.key.replace(/_/g, ' ').replace(/-/g, '.');

              return label + ' (' + Math.round(d.value * 100) + '%)';
            });

          return x_padding_left + x_scale_stacked_bar(x_marker_this);
        })

      return;
    }

    svg.attr('width', width)
      .attr('height', height);

    svg.attr('viewBox', '0 0 450 90')
      .attr('preserveAspectRatio', 'xMinYMin meet');

    //add stacked bar chart
    rects.data(data).enter().append('rect')
      .attr('class', function(d) {
        return 'bar bar_' + d.key;
      })
      .attr('width', function(d) {
        return (d.value == undefined) ? x_scale_stacked_bar(0) :
          x_scale_stacked_bar(d.value).toFixed(1);
      })
      .attr('x', function(d) {
        if (d.value == undefined) d.value = 0;

        var x_marker_this = x_marker;
        x_marker += d.value;

        //append circle
        svg.append('circle')
          .attr('r', 8)
          .attr('class', function() {
            return 'tippy tippy_' + d.key;
          })
          .attr('cx', function() {
            return x_padding_left + x_scale_stacked_bar(
              x_marker_this + ((x_marker - x_marker_this) / 2));
          })
          .attr('cy', bar_y_position + bar_height - 3)
          .style('fill', function() {
            return color[d.key];
          })
          .style('opacity', function() {
            if (d.value < 0.04)
              return 0;
          });

        //append text labels
        svg.append('text')
          .attr('class', function() {
            return 'tippytext tippytext_' + d.key;
          })
          .attr('text-anchor', 'middle')
          .attr('x', function() {
            return x_padding_left + x_scale_stacked_bar(
              x_marker_this + ((x_marker - x_marker_this) / 2));
          })
          .attr('y', function() {
            return bar_y_position + bar_height + 22;
          })
          .text(function() {
            var label = d.key.replace(/_/g, ' ').replace(/-/g, '.');

            return label + ' (' + Math.round(d.value * 100) + '%)';
          })
          .style('fill', function() {
            return 'white';
          });

        return x_padding_left + x_scale_stacked_bar(x_marker_this);
      })
      .attr('y', function(d) {
        return bar_y_position;
      })
      .attr('height', function(d) {
        return bar_height;
      })
      .style('fill', function(d) {
        return color[d.key];
      })
      .style('display', function(d, i) {
        if (i == 0) {
          $(target + ' .tippy').hide();
          $(target + ' .tippy_' + d.key).show();

          $(target + ' .tippytext').hide();
          $(target + ' .tippytext_' + d.key).show();
        }
      })
      .on('click', function(d) {
        $(target + ' .tippy').hide();
        $(target + ' .tippy_' + d.key).show();

        $(target + ' .tippytext').hide();
        $(target + ' .tippytext_' + d.key).show();
      })
      .on('mouseenter', function(d) {
        $(target + ' .tippy').hide();
        $(target + ' .tippy_' + d.key).show();

        $(target + ' .tippytext').hide();
        $(target + ' .tippytext_' + d.key).show();
      });
  }


  d3.json('data/hwsurvey-weekly-new-fields.json', function(data_gfx) {
    //d3.json('https://analysis-output.telemetry.mozilla.org/game-hardware-survey/data/hwsurvey-weekly.json', function(data_gfx) {
    data_gfx.map(function(d) {
      //consolidate Mac releases
      d['os_Darwin'] = 0;
      d['os_Darwin'] += d['os_Darwin-15.6.0'] || 0;
      d['os_Darwin'] += d['os_Darwin-14.5.0'] || 0;
      d['os_Darwin'] += d['os_Darwin-Other'] || 0;

      //group CPU speeds
      d['grouped_cpu_speed_1.4_or_less'] = d['cpu_speed_1.3'];
      d['grouped_cpu_speed_1.4_to_1.49'] = d['cpu_speed_1.4'];
      d['grouped_cpu_speed_1.5_to_1.69'] = d['cpu_speed_1.5'] + d[
        'cpu_speed_1.6'];
      d['grouped_cpu_speed_1.7_to_1.99'] = d['cpu_speed_1.7'] + d[
        'cpu_speed_1.8'] + d['cpu_speed_1.9'];
      d['grouped_cpu_speed_2_to_2.29'] = d['cpu_speed_2.0'] + d[
        'cpu_speed_2.1'] + d['cpu_speed_2.2'];
      d['grouped_cpu_speed_2.3_to_2.69'] = d['cpu_speed_2.3'] + d[
        'cpu_speed_2.4'] + d['cpu_speed_2.5'] + d['cpu_speed_2.6'];
      d['grouped_cpu_speed_2.7_to_2.99'] = d['cpu_speed_2.7'] + d[
        'cpu_speed_2.8'] + d['cpu_speed_2.9'];
      d['grouped_cpu_speed_3.0_to_3.29'] = d['cpu_speed_3.0'] + d[
        'cpu_speed_3.1'] + d['cpu_speed_3.2'];
      d['grouped_cpu_speed_3.3_to_3.69'] = d['cpu_speed_3.3'] + d[
        'cpu_speed_3.4'] + d['cpu_speed_3.5'] + d['cpu_speed_3.6'];
    });

    //sort by date
    MG.convert.date(data_gfx, 'date');
    data_gfx.sort(function(a, b) {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });
    console.log(data_gfx);

    //take first one and use that to build the stacked bar charts
    global.data = data_gfx;
    drawHeroCharts(global.data[global.heroIndex]);

    //draw the rest of the charts
    drawCharts([data_gfx]);
  });

  function topX(prefix, data) {
    var subset = [];
    Object.keys(data).forEach(function(prop) {
      if (prop.indexOf(prefix) !== -1) {
        subset.push({
          key: prop,
          value: +data[prop]
        });
      }
    });

    subset.sort(function(a, b) {
      if (a.value < b.value) return 1;
      if (a.value > b.value) return -1;
      return 0;
    });
    return subset;
  }

  function drawCharts(data) {
    var target;

    /*var cpu_speed = topX('cpu_speed_', global.data[0]);
      var cpu_speed_keys = [];
      var cpu_speed_labels = [];
      cpu_speed.forEach(function(d, i) {
        cpu_speed_keys.push(d.key);
        var nicy = d.key.replace('cpu_speed_', '');
          
        cpu_speed_labels.push((nicy == 'Other') ? nicy : nicy + ' GHz');
      });*/

    target = '#detail-processor-speed';
    MG.data_graphic({
      title: "CPU Speeds",
      data: data,
      format: 'perc',
      animate_on_load: true,
      width: global.chart.width,
      height: global.chart.height,
      xax_count: global.chart.xax_count,
      yax_count: 10,
      right: global.chart.right,
      target: target,
      //y_accessor: cpu_speed_keys,
      //legend: cpu_speed_labels,
      y_accessor: ['grouped_cpu_speed_1.4_or_less',
        'grouped_cpu_speed_1.4_to_1.49',
        'grouped_cpu_speed_1.5_to_1.69',
        'grouped_cpu_speed_1.7_to_1.99',
        'grouped_cpu_speed_2_to_2.29',
        'grouped_cpu_speed_2.3_to_2.69',
        'grouped_cpu_speed_2.7_to_2.99',
        'grouped_cpu_speed_3.0_to_3.29',
        'grouped_cpu_speed_3.3_to_3.69', 'cpu_speed_Other'
      ],
      legend: ['Less than 1.4 GHz', '1.4 GHz to 1.49 GHz',
        '1.5 GHz to 1.69 GHz', '1.7 GHz to 1.99 GHz',
        '2.0 GHz to 2.29 GHz', '2.3 GHz to 2.69 GHz',
        '2.7 GHz to 2.99 GHz', '3.0 GHz to 3.29 GHz',
        '3.3 GHz to 3.69 GHz', 'Other'
      ],
      mouseover: mouseover(target),
      mouseout: mouseout(target),
      full_width: true,
    });

    var cores = topX('cores_', global.data[0]);
    var cores_keys = [];
    var cores_labels = [];
    cores.forEach(function(d, i) {
      cores_keys.push(d.key);
      var nicy = d.key.replace('cores_', '');

      cores_labels.push((nicy == 'Other') ? '3 or 8+ cores' : (nicy ==
        1) ? nicy + ' core' : nicy + ' cores');
    });
    target = '#detail-processor-cores';
    MG.data_graphic({
      title: "CPU Cores",
      data: data,
      format: 'perc',
      animate_on_load: true,
      width: global.chart.width,
      height: 300,
      xax_count: global.chart.xax_count,
      right: global.chart.right,
      target: target,
      y_accessor: cores_keys,
      legend: cores_labels,
      mouseover: mouseover(target),
      mouseout: mouseout(target),
      full_width: true,
    });

    target = '#detail-pc-video-card'
    MG.data_graphic({
      title: "GPU",
      data: data,
      format: 'perc',
      animate_on_load: true,
      width: global.chart.width,
      height: 300,
      xax_count: global.chart.xax_count,
      right: global.chart.right,
      target: target,
      full_width: true,
      mouseover: mouseover(target),
      mouseout: mouseout(target),
      max_y: 1,
      x_accesor: 'date',
      y_accessor: ['gpu_Intel', 'gpu_NVIDIA', 'gpu_AMD'],
      legend: ['Intel', 'NVIDIA', 'AMD']
    });

    target = '#detail-operating-systems';
    var os = topX('os_', global.data[0]);
    var os_keys = [];
    var os_labels = [];
    os.forEach(function(d, i) {
      if (d.key == 'os_Darwin')
        return;

      os_keys.push(d.key);
      os_labels.push(d.key.replace('os_', ''));
    });
    MG.data_graphic({
      title: "Operating System",
      data: data,
      format: 'perc',
      animate_on_load: true,
      width: global.chart.width,
      height: global.chart.height + 100,
      xax_count: global.chart.xax_count,
      yax_count: 10,
      right: global.chart.right,
      target: target,
      full_width: true,
      mouseover: mouseover(target),
      mouseout: mouseout(target),
      x_accesor: 'date',
      y_accessor: os_keys,
      legend: os_labels
    });

    target = '#detail-processor';
    MG.data_graphic({
      title: "CPU",
      data: data,
      format: 'perc',
      animate_on_load: true,
      width: global.chart.width,
      height: 300,
      xax_count: global.chart.xax_count,
      right: global.chart.right,
      target: target,
      full_width: true,
      mouseover: mouseover(target),
      mouseout: mouseout(target),
      max_y: 1,
      x_accesor: 'date',
      y_accessor: ['cpu_GenuineIntel', 'cpu_AuthenticAMD'],
      legend: ['Intel', 'AMD']
    });

    target = '#detail-display-resolution';
    var display_resolutions = topX('display_', global.data[0]);
    var display_resolutions_keys = [];
    var display_resolutions_labels = [];
    display_resolutions.forEach(function(d, i) {
      display_resolutions_keys.push(d.key);
      display_resolutions_labels.push(d.key.replace('display_', ''));
    });
    MG.data_graphic({
      title: "Display Resolution",
      data: data,
      format: 'perc',
      animate_on_load: true,
      width: global.chart.width,
      height: global.chart.height,
      xax_count: global.chart.xax_count,
      yax_count: 10,
      right: global.chart.right,
      target: target,
      full_width: true,
      mouseover: mouseover(target),
      mouseout: mouseout(target),
      x_accesor: 'date',
      y_accessor: display_resolutions_keys,
      legend: display_resolutions_labels
    });

    target = '#detail-ram';
    var ram = topX('ram_', global.data[0]);
    var ram_keys = [];
    var ram_labels = [];
    ram.forEach(function(d, i) {
      ram_keys.push(d.key);
      var nicy = d.key.replace('ram_', '');

      ram_labels.push((nicy == 'Other') ? nicy : nicy + 'GB');
    });
    MG.data_graphic({
      title: "Memory",
      data: data,
      format: 'perc',
      animate_on_load: true,
      width: global.chart.width,
      height: global.chart.height,
      xax_count: global.chart.xax_count,
      yax_count: 8,
      right: global.chart.right,
      target: target,
      full_width: true,
      mouseover: mouseover(target),
      mouseout: mouseout(target),
      x_accesor: 'date',
      y_accessor: ram_keys,
      legend: ram_labels
    });

    // gives us the top gpu models
    draw_gpu_models();

    target = '#detail-browser-share-32-64';
    MG.data_graphic({
      title: "Browsers by Architecture",
      data: data,
      format: 'perc',
      animate_on_load: true,
      width: global.chart.width,
      height: 300,
      xax_count: global.chart.xax_count,
      right: global.chart.right,
      target: target,
      mouseover: mouseover(target),
      mouseout: mouseout(target),
      x_accesor: 'date',
      y_accessor: ['browser_arch_x86', 'browser_arch_x86-64'],
      legend: ['32-bit', '64-bit'],
      max_y: 1,
      full_width: true,
    });

    target = '#detail-browser-share-os-32-64';
    MG.data_graphic({
      title: "OSs by Architecture",
      data: data,
      format: 'perc',
      animate_on_load: true,
      width: global.chart.width,
      height: 300,
      xax_count: global.chart.xax_count,
      right: global.chart.right,
      mouseover: mouseover(target),
      mouseout: mouseout(target),
      target: target,
      y_accessor: ['osarch_x86', 'osarch_x86-64'],
      legend: ['32-bit', '64-bit'],
      max_y: 1,
      full_width: true,
    });

    MG.data_graphic({
      title: "Flash",
      data: data,
      format: 'perc',
      animate_on_load: true,
      width: global.chart.width,
      height: 300,
      xax_count: global.chart.xax_count,
      right: global.chart.right,
      target: '#detail-flash',
      y_accessor: ['has_flash_True'],
      legend: ['Has Flash'],
      max_y: 1,
      area: true,
      full_width: true,
    });
  }

  function nicify_cpu_core_str(str) {
    var bits = str.split('_');
    return bits[2] + ' cores (' + bits[3] + 'GHz)';
  }

  function draw_gpu_models() {
    var target = '#detail-gpu-model';

    var gpu_models = topX('gpu_model_', global.data[0]);
    var gpu_models_keys = [];
    var gpu_models_labels = [];
    gpu_models.forEach(function(d, i) {
      if (d.key == 'gpu_model_Other' || d.key == 'gpu_model_Unknown')
        return;

      gpu_models_keys.push(d.key);
      gpu_models_labels.push(global.gpu_model_nice[d.key]);
    });

    var args = {
      title: "GPU Model",
      data: [global.data],
      format: 'perc',
      animate_on_load: true,
      width: global.chart.width,
      height: global.chart.height + 100,
      xax_count: global.chart.xax_count,
      yax_count: 10,
      right: global.chart.right,
      target: target,
      full_width: true,
      mouseover: mouseover(target),
      mouseout: mouseout(target),
      y_accessor: gpu_models_keys,
      legend: gpu_models_labels
    };

    MG.data_graphic(args);

    //color lines based on vendor
    var r = /\d+/;
    d3.select(target).selectAll('.mg-line-legend text')
      .each(function() {
        var line_id_to_set;
        var vendor;

        //get text
        if (d3.select(this).node().innerHTML.indexOf('*') !== -1) {
          vendor = 'vendor-nvidia';
        } else if (d3.select(this).node().innerHTML.indexOf('†') !== -1) {
          vendor = 'vendor-amd';
        } else {
          vendor = 'vendor-intel';
        }

        //original line ID          
        var line_id = d3.select(this).node().classList[0].match(r);

        //set vendor for legend labels
        d3.select(this)
          .classed(vendor, true)

        //cascade change to associated line and circle too
        d3.select(target).selectAll('path.mg-line' + line_id + '-color')
          .classed(vendor + '-line', true);

        d3.select(target).selectAll('circle.mg-line' + line_id + '-color')
          .classed(vendor, true)
          .classed(vendor + '-line', true);
      });
  }

  d3.select('.hero-left')
    .on('click', function() {
      d3.event.preventDefault();

      global.heroIndex += 1;
      if (global.heroIndex >= global.data.length) {
        global.heroIndex = global.data.length - 1;
        $('.hero-left')
          .effect('shake', {
            distance: 3,
            times: 2
          }, 500);
      } else if (global.heroIndex >= global.data.length) {
        global.heroIndex = global.data.length - 1;
      }

      drawHeroCharts(global.data[global.heroIndex]);
    });

  d3.select('.hero-right')
    .on('click', function() {
      d3.event.preventDefault();

      global.heroIndex -= 1;
      if (global.heroIndex < 0) {
        global.heroIndex = 0;
        $('.hero-right')
          .effect('shake', {
            distance: 3,
            times: 2
          }, 500);
      } else if (global.heroIndex >= global.data.length) {
        global.heroIndex = global.data.length - 1;
      }

      drawHeroCharts(global.data[global.heroIndex]);
    });

  window.onresize = function(event) {
    d3.selectAll('.hero svg')
      .attr('width', function() {
        var width = d3.select(this).node().parentElement.clientWidth;
        return (width > 450) ? 450 : width;
      });
  };
}());