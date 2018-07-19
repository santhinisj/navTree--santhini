/* jshint esversion:6 */
$('#displayYears').click(() => {
    let checkIfYears = document.querySelector('.information');
    console.log(checkIfYears);

    if (!checkIfYears.hasChildNodes()) {
        $.getJSON('/years', (data) => {
            let years = data;
            $.each(years, function(i, val) {
                // console.log(val);
                $('.information').append('<li>' + val._id + '</li>');
                $('.information li').addClass('yearValue');
            });
            // getTeams();
        });
    }


});

// const getTeams = () => {
$('.information').on('click', 'li.yearValue', ((e) => {
    e.stopPropagation();
    e.preventDefault();
    let source = (e.target);
    let year = e.target.textContent;
    if (e.target.childElementCount === 0) {
        $.getJSON('/years/' + year, (data) => {
            let teams = data;
            $(e.target).append('<ul></ul>');
            $.each(teams, function(i, val) {
                // console.log($(e.target).first());
                $($(e.target).find('ul')).append('<li class = "teamValue">' + val._id + '</li>')
            });
            getBowlers();
        });
    } else {
        $($('.yearValue').find('ul')).remove();
    }
}));
// };

// const getBowlers = () => {
$('.information').on('click', 'li.teamValue', ((e) => {
    // e.stopPropagation();
    e.preventDefault();
    let team = e.target.textContent;
    let year = e.target.parentElement.parentElement.firstChild.textContent;
    if (e.target.childElementCount === 0) {
        $.getJSON('/years/' + year + '/teams/' + team, (data) => {
            let bowlers = data;
            // console.log(json);
            $.each(bowlers, function(i, val) {
                // console.log($(e.target).first());
                $($(e.target).find('ul')).append('<li class = "bowlers">' + val._id + '</li>');

            });
            // getBowlerDetails();
        });
    } else {
        $($('.yearValue').find('ul')).remove();
    }


}));
// };


// const getBowlerDetails = () => {
$('.information').on('click', 'li.bowlers', ((e) => {
    // e.preventDefault();
    // e.stopPropagation();
    let team = e.target.parentElement.parentElement.firstChild.textContent;
    let year = e.target.parentElement.parentElement.parentElement.parentElement.firstChild.textContent;
    let bowler = e.target.textContent;
    console.log('team', team);
    console.log('year', year);
    console.log('bowler', bowler);

    $.getJSON('/years/' + year + '/teams/' + team + '/bowler/' + bowler, (data) => {
        let teamDetails = data;
        console.log("charts4");
        let topEconomicalBowlers = (window.data);
        let bowlers = [];
        let economyRate = [];

        for (each of data) {
            bowlers.push(each._id);
            economyRate.push(each.economy);
        }
        let container = document.createElement('div');
        $('.container1').empty();
        $('.container1').append(container);
        // if ($('.container1').childElementCount ===0) {

        // }
        window.chart = new Highcharts.Chart({
            chart: {
                renderTo: container,
                height: 600,
                type: 'column'
            },
            title: {
                text: 'TOP ECONOMICAL BOWLERS'
            },
            xAxis: {
                categories: bowlers
            },
            yAxis: {
                text: 'Extra Economy Rate',
                data: economyRate
            },
            series: [{
                name: 'Economy Rate',
                data: economyRate
            }]
        });
    });
}));