const staticItem1 = {
  name: 'hello',
  content: [
    {
      columnname: 'new phone',
      columnitems: [
        {
          rowname: 'good phone',
          rowdescription: 'very nice features',
        },
      ],
    },
  ],
};
const staticItem2 = {
  name: 'hello2',
  content: [
    {
      columnname: 'new phone2',
      columnitems: [
        {
          rowname: 'good phone2',
          rowdescription: 'very nice features2',
        },
        {
          rowname: 'good phone3',
          rowdescription: 'very nice features3',
        },
      ],
    },
    {
      columnname: 'new phone232',
      columnitems: [
        {
          rowname: 'good phone33',
          rowdescription: 'very nice features33',
        },
        {
          rowname: 'good phone',
          rowdescription: 'very nice features33',
        },
      ],
    },
  ],
};

module.exports = { staticItem1, staticItem2 };
