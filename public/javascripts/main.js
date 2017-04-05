$(function () {
    $('#tabs').w2tabs({
        name: 'tabs',
        active: 'tab1',
        tabs: [
            { id: 'tab1', text: 'Tab 1' },
            { id: 'tab2', text: 'Tab 2' },
            { id: 'tab3', text: 'Tab 3' },
            { id: 'tab4', text: 'Tab 4' }
        ],
        onClick: function (event) {
            $('#selected-tab').html(event.target);
        }
    });
});
