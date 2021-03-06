module.exports = (function(test, mmvp, delay_ms) {
  var harness = test.createHarness();
  harness.createStream().pipe(process.stdout);
  harness('add,populate, remove, and empty callbacks work', function(t) {
    t.plan(6);
    var p = new mmvp();
    var expect_add_key, expect_add_value;
    var expect_remove_key, expect_remove_value;
    var populate_fn_has_run = false;
    var empty_fn_has_run = false;
    var add_key = 'mykey';
    var add_value = 'myvalue';

    p.set_action({
      add: function(key, value) {
        expect_add_key = key;
        expect_add_value = value;
      },
      populate: function() {
        populate_fn_has_run = true;
      },
      empty: function() {
        if (!populate_fn_has_run) { return; }
        empty_fn_has_run = true;
      },
      remove: function(key, value) {
        expect_remove_key = key;
        expect_remove_value = value;
      }
    });

    setTimeout(function() { 
      t.equal(populate_fn_has_run, true, 'Populate function fn runs when model becomes populated');

      t.equal(expect_add_key, 'mykey', 'Add fn was triggered with proper key');
      t.equal(expect_add_value, 'myvalue', 'Add fn was triggered with proper value'); 

      t.equal(expect_remove_key, 'mykey', 'Remove fn was triggered with proper key');
      t.equal(expect_remove_value, 'myvalue', 'Remove fn was triggered with proper value'); 

      t.equal(empty_fn_has_run, true, 'Empty fn runs when model becomes empty');
    }, delay_ms);
    p.initialize();
    p.sync({ 'mykey': 'myvalue' });
    p.sync({});
  });
});
