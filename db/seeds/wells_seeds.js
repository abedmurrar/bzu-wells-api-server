exports.seed = function(knex) {
    // Deletes ALL existing entries
    // return knex('wells').del()
    // .then(function () {
    // Inserts seed entries
    return knex('wells').insert([
        {
            id: 1,
            name: 'Tower Tank',
            depth: 5 * 100 /* cm */,
            volume: 500,
            is_active: true
        },
        {
            id: 2,
            name: 'New Tank',
            depth: 4.9 * 100 /* cm */,
            volume: 3063,
            is_active: true
        },
        {
            id: 3,
            name: 'Old Tank',
            depth: 2 * 100 /* cm */,
            volume: 3000,
            is_active: true
        },
        {
            id: 4,
            name: 'Engineering Football Field',
            depth: 3.4 * 100 /* cm */,
            volume: 2040,
            is_active: true
        },
        {
            id: 5,
            name: 'Nursing Faculty',
            depth: 4 * 100 /* cm */,
            volume: 556,
            is_active: true
        },
        {
            id: 6,
            name: 'Media Building',
            depth: 3 * 100 /* cm */,
            volume: 519,
            is_active: true
        },
        {
            id: 7,
            name: 'Education Building',
            depth: 4.4 * 100 /* cm */,
            volume: 1450,
            is_active: true
        },
        {
            id: 8,
            name: 'Literature Building',
            depth: 3.5 * 100 /* cm */,
            volume: 1260,
            is_active: true
        },
        {
            id: 9,
            name: 'Main Library Building',
            depth: 2.25 * 100 /* cm */,
            volume: 225,
            is_active: true
        },
        {
            id: 10,
            name: 'Arts Building',
            depth: 3.75 * 100 /* cm */,
            volume: 564,
            is_active: true
        },
        {
            id: 11,
            name: 'Science Building',
            depth: 3.1 * 100 /* cm */,
            volume: 1000,
            is_active: true
        },
        {
            id: 12,
            name: 'Engineering Building',
            depth: 3 * 100 /* cm */,
            volume: 900,
            is_active: true
        }
    ]);
    // });
};
