(function() {
    'use strict'

    var global = {
        chart: {
            width: 350,
            height: 240,
            left: 0,
            right: 95,
            xax_count: 4
        },
        expanded_chart: {
            height: 780
        },
        gpu_models: {
          min_lines: 6,
          max_lines: 19
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
          'gpu_model_NV40-C61': 'GeForce NV40*'
        }
    };

    var mouseover = function(target) {
      return function() {
        //reduce opacity of all other lines but this one
        var hiding_these = '';
        var r = /\d+/;

        d3.selectAll(target + ' .mg-line-rollover-circle').nodes().forEach(function(d) {
          if(d3.select(d).style('opacity') === '0' || d3.select(d).attr('r') === '0') {
            var line_id = d.classList[0].match(r);
            hiding_these += 'path.mg-line' + line_id + ',';
            hiding_these += '.mg-line-legend .mg-line' + line_id + '-legend-color,';
          }
        });

        d3.select(target).selectAll(hiding_these.slice(0,-1))
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
    d3.selectAll('ul.category li a.pill')
      .on('click', function() {
        d3.event.preventDefault();

        d3.selectAll('ul.category li a.pill')
            .classed('active', false);

        d3.select(this)
            .classed('active', true);

        var section = d3.select(this).attr('href').slice(6);
        document.location.hash = section;

        reorderCharts(section);

        // trigger resize since we're not resizing hidden svgs
        window.dispatchEvent(new Event('resize'));

        return false;
    });

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

    d3.json('data/hwsurvey-weekly-new-fields.json', function(data_gfx) {
    //d3.json('https://analysis-output.telemetry.mozilla.org/game-hardware-survey/data/hwsurvey-weekly.json', function(data_gfx) {
        data_gfx.map(function(d) {
            //consolidate 'el capitan' releases
            d['os_Darwin-15'] = 0;
            d['os_Darwin-15'] += d['os_Darwin-15.0.0'] || 0;
            d['os_Darwin-15'] += d['os_Darwin-15.2.0'] || 0;
            d['os_Darwin-15'] += d['os_Darwin-15.3.0'] || 0;
            d['os_Darwin-15'] += d['os_Darwin-15.4.0'] || 0;
            d['os_Darwin-15'] += d['os_Darwin-15.5.0'] || 0;
            d['os_Darwin-15'] += d['os_Darwin-15.6.0'] || 0;

            // generate dummy data points, until we get new data file
            data_gfx.push(MG.clone(data_gfx[0]));
            data_gfx.push(MG.clone(data_gfx[0]));
            data_gfx.push(MG.clone(data_gfx[0]));
            data_gfx[1].date = "2016-09-05";
            data_gfx[2].date = "2016-09-12";
            data_gfx[3].date = "2016-09-19";
            console.log(data_gfx);
        });

        drawCharts([data_gfx]);
        
        // on first-load
        var section = (document.location.hash) ? document.location.hash.slice(1) : 'all';
        d3.selectAll('.category li a')
            .filter(function() {
                return d3.select(this).attr('href') == '#goto-' + section;
            })
            .classed('active', true);

        reorderCharts(section);
    });

    function topX(prefix, data) {
      var subset = [];
      Object.keys(data).forEach(function(prop) {
        if(prop.indexOf(prefix) !== -1) {
          subset.push({key: prop, value: +data[prop]});
        }
      });

      subset.sort(function(a, b) {
        if(a.value < b.value) return 1;
        if(a.value > b.value) return -1;
        return 0;
      });
      return subset;
    }

    function drawCharts(data) {
      var target;
      for (var i = 0; i < data.length; i++) {
        data[i] = MG.convert.date(data[i], 'date', '%Y-%m-%d');
      }

      global.data = data;

      target = '#pc-video-card'
      MG.data_graphic({
            title: "GPU Vendor",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: global.chart.height,
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

        target = '#operating-systems';
        MG.data_graphic({
            title: "Operating System",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: global.chart.height,
            xax_count: global.chart.xax_count,
            right: global.chart.right,
            target: target,
            full_width: true,
            mouseover: mouseover(target),
            mouseout: mouseout(target),
            x_accesor: 'date',
            y_accessor: ['os_Windows_NT-6.1', 'os_Windows_NT-10.0', 'os_Windows_NT-5.1', 'os_Windows_NT-6.3', 'os_Darwin-15'],
            legend: ['Win 7', 'Win 10', 'Win XP', 'Win 8.1', 'OS X 15']
        });

        target = '#processor';
        MG.data_graphic({
            title: "Processor",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: global.chart.height,
            xax_count: global.chart.xax_count,
            right: global.chart.right,
            target: target,
            full_width: true,
            mouseover: mouseover(target),
            mouseout: mouseout(target),
            max_y: 1,
            x_accesor: 'date',
            y_accessor: ['cpu_AuthenticAMD','cpu_GenuineIntel'],
            legend: ['Intel', 'AMD']
        });

        target = '#no-of-cpus';
        MG.data_graphic({
            title: "Processor Cores",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: global.chart.height,
            xax_count: global.chart.xax_count,
            right: global.chart.right,
            target: target,
            full_width: true,
            mouseover: mouseover(target),
            mouseout: mouseout(target),
            max_y: 1,
            x_accesor: 'date',
            y_accessor: ['cores_2', 'cores_4', 'cores_1', 'cores_3'],
            legend: ['2 cores', '4 cores', '1 core', '3 cores']
        });

        target = '#display-resolution';
        MG.data_graphic({
            title: "Display Resolution",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: global.chart.height,
            xax_count: global.chart.xax_count,
            right: global.chart.right,
            target: target,
            full_width: true,
            mouseover: mouseover(target),
            mouseout: mouseout(target),
            x_accesor: 'date',
            y_accessor: ['display_1366x768', 'display_1920x1080', 'display_1600x900', 'display_1280x1024', 'display_1024x768'],
            legend: ['1366x768', '1920x1080', '1600x900', '1280x1024', '1024x768']
        });

        target = '#ram';
        MG.data_graphic({
            title: "Memory",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: global.chart.height,
            xax_count: global.chart.xax_count,
            right: global.chart.right,
            target: target,
            full_width: true,
            mouseover: mouseover(target),
            mouseout: mouseout(target),
            x_accesor: 'date',
            y_accessor: ['ram_4', 'ram_2', 'ram_8', 'ram_3', 'ram_1'],
            legend: ['4GB', '2GB', '8GB', '3GB', '1GB']
        });

        // gives us the top gpu models
        // TODO
        //var gpu_models = topX('gpu_model_', data[0][0]);

        draw_gpu_models(global.gpu_models.min_lines, global.chart.height);

        target = '#browser-share-32-64';
        MG.data_graphic({
            title: "Browsers by Architecture",
            description: "The share of 32-to-64-bit browsers.",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: global.chart.height,
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

        target = '#browser-share-os-32-64';
        MG.data_graphic({
            title: "OSs by Architecture",
            description: "The share of 32-to-64-bit operating systems. Note that this metric likely undercounts non-Windows OSs.",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: global.chart.height,
            xax_count: global.chart.xax_count,
            right: global.chart.right,
            mouseover: mouseover(target),
            mouseout: mouseout(target),
            target: target,
            y_accessor: ['os_arch_x86', 'os_arch_x86-64'],
            legend: ['32-bit', '64-bit'],
            max_y: 1,
            full_width: true,
        });

        MG.data_graphic({
            title: "Flash",
            description: "Is the Flash plugin available?",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: global.chart.height,
            xax_count: global.chart.xax_count,
            right: global.chart.right,
            target: '#flash',
            y_accessor: ['has_flash_True'],
            legend: ['Yes'],
            max_y: 1,
            area: false,
            full_width: true,
        });

        MG.data_graphic({
            title: "Silverlight",
            description: "Is the Silverlight plugin available?",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: global.chart.height,
            xax_count: global.chart.xax_count,
            right: global.chart.right,
            target: '#silverlight',
            y_accessor: ['has_silverlight_True'],
            legend: ['Yes'],
            max_y: 1,
            area: false,
            full_width: true,
        });

        MG.data_graphic({
            title: "Unity",
            description: "Is the Unity Web Player available?",
            data: data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: global.chart.height,
            xax_count: global.chart.xax_count,
            right: global.chart.right,
            target: '#unity',
            y_accessor: ['has_unity_True'],
            legend: ['Yes'],
            max_y: 1,
            area: false,
            full_width: true,
        });
    }
    
    function draw_gpu_models(how_many, height) {
        var target = '#gpu-model';

        var gpu_models = topX('gpu_model_', global.data[0][0]);
        var gpu_models_keys = [];
        var gpu_models_labels = [];
        gpu_models.forEach(function(d, i) {
          if(d.key == 'gpu_model_Other' || i > how_many)
              return;

          gpu_models_keys.push(d.key);
          gpu_models_labels.push(global.gpu_model_nice[d.key]);
        });

        MG.data_graphic({
            title: "GPU Model",
            description: "Click anywhere to show an expanded list of GPU models. Those marked with an asterisk (*) are NVIDIA GPUs, those marked with a dagger (†) are AMD GPUs, and unmarked ones are Intel integrated GPUs.",
            data: global.data,
            format: 'perc',
            animate_on_load: true,
            width: global.chart.width,
            height: height,
            xax_count: global.chart.xax_count,
            right: global.chart.right,
            target: target,
            full_width: true,
            mouseover: mouseover(target),
            mouseout: mouseout(target),
            y_accessor: gpu_models_keys,
            max_y: 0.1,
            legend: gpu_models_labels
        });
        
      //color lines based on vendor
      var r = /\d+/;
      d3.select(target).selectAll('.mg-line-legend text')
        .style('fill', function() {
          var line_id_to_set;
          var vendor;

          //get text
          if(d3.select(this).node().innerHTML.indexOf('*') !== -1) {
            vendor = 'vendor-nvidia';
          } else if(d3.select(this).node().innerHTML.indexOf('†') !== -1) {
            vendor = 'vendor-amd';
          } else {
            vendor = 'vendor-intel';
          }
          
          //original line ID          
          var line_id = d3.select(this).node().classList[0].match(r);

          //set vendor for legend labels
          d3.select(this)
            .classed(vendor, true)

          //cascade change to associated line too
          d3.select(target).selectAll('.mg-line' + line_id + '-color')
            .classed(vendor + '-line', true);
        });
    }

    // expanders for charts
    d3.select('#gpu-model')
      .on('click', function() {
        //set expanded class
        var expanded = d3.select(this)
          .classed('expanded');

        if(expanded) {
          d3.select(this)
            .classed('expanded', false);
          draw_gpu_models(global.gpu_models.min_lines, global.chart.height);
          } else {
            d3.select(this)
              .classed('expanded', true);
            draw_gpu_models(global.gpu_models.max_lines, global.expanded_chart.height);
          }
        });
}());