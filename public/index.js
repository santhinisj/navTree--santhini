/* jshint esversion:6 */
$('#displayYears').click(() => {
    let checkIfYears = document.querySelector('.information');
    console.log(checkIfYears);

    if (!checkIfYears.hasChildNodes()) {
        fetch('/years')
            .then(res => res.json())
            .then(json => {
                let years = json;
                $.each(years, function(i, val) {
                    console.log(val);
                    $('.information').append('<li>' + val._id + '</li>');
                    $('.information li').addClass('yearValue');
                });
                getTeams();
            });
    }


});

const getTeams = () => {
    $('.yearValue').click((e) => {
        // $('.yearValue').find('.ul').hide();
        console.log(e.target.textContent);
        let source = (e.target);
        let year = e.target.textContent;
        $($('.yearValue').find('ul')).hide();
        if (e.target.childElementCount === 0) {
            fetch('/years/' + year)
                .then(res => res.json())
                .then(json => {
                    let teams = json;
                    // console.log(teams);
                    $(e.target).append('<ul></ul>');
                    $.each(teams, function(i, val) {
                        console.log($(e.target).first());
                        $($(e.target).find('ul')).append('<li>' + val._id + '</li>')
                    });
                    // $('.information li').('yearValue');

                });
        } else if ($($(e.target).find('ul')).is(':hidden')) {
            $($('.yearValue').find('ul')).hide();
            $($(e.target).find('ul')).show();
            // $(e.target).detach();
        } else {
            $($('.yearValue').find('ul')).hide();
            // $(e.target).detach();
        }

    });
};