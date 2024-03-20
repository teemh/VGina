import { test, expect } from '@playwright/test';
import { actionResponse} from '../main/actionHandler.js';

test.describe('Timer action tests', () => {
  const player = "TestPlayer"; 
  let line = "";
  let action = { type: "timer", key: "", search: "", sound: "", regex: true };

  // TODO (Allegro): change test after implementation complete.
  test('On timer match return true.', ({}) => {
    line = "line match";
    action.search = "{S} match";
    expect(actionResponse(player, line, action)).toEqual("true");
  });

});

test.describe('Sound action tests', () => {
  const player = "TestPlayer"; 
  let line = "";
  let action = { type: "sound", key: "", search: "", sound: "", regex: true };

  test('On match return orginal sound.', ({}) => {
    line = "line match";
    action.search = "{S} match";
    action.sound = "tell";
    expect(actionResponse(player, line, action)).toEqual(action.sound);
  });
});

test.describe('Speak action tests', () => {
  const player = "TestPlayer"; 
  let line = "";
  let action = { type: "speak", key: "", search: "", sound: "", regex: true };

  test('On match return possibly altered sound', ({}) => {
    line = "line match";
    action.search = "match";
    action.sound = "matched";
    expect(actionResponse(player, line, action)).toEqual("matched");
  });
});

test.describe('Common action tests', () => {
  const player = "TestPlayer"; 
  let line = "";
  let action = { type: "", key: "", search: "", sound: "", regex: true };

  test('No match', ({}) => {
    line = "line match";
    action.search = "nomatch";
    expect(actionResponse(player, line, action)).toEqual(false);
  });

  test('Case insensitive on search string', ({}) => {
    line = "line match";
    action.search = "match";
    action.sound = "matched";
    expect(actionResponse(player, line, action)).toEqual(action.sound);
    action.search = "Match";
    expect(actionResponse(player, line, action)).toEqual(action.sound);
  });

  test('Case insensitive on response string', ({}) => {
    line = "line match";
    action.search = "match";
    action.sound = "matched";
    expect(actionResponse(player, line, action)).toEqual(action.sound.toLowerCase());
    action.sound = "MATCHED";
    expect(actionResponse(player, line, action)).toEqual(action.sound.toLowerCase());
  });

  test('Case insensitive on line.', ({}) => {
    line = "line MATCH";
    action.search = "match";
    action.sound = "matched";
    expect(actionResponse(player, line, action)).toEqual(action.sound);
    line = "line MaTcH";
    expect(actionResponse(player, line, action)).toEqual(action.sound);
  });
});

test.describe('Support for {C} matching in actions', () => {
  const player = "TestPlayer"; 
  let line = "TestPlayer";
  let action = { type: "speak", key: "", search: "", sound: "", regex: true };
  
  test('Matched', ({}) => {
    action.search = "{C}";
    action.sound = "matched";
    expect(actionResponse(player, line, action)).toEqual(action.sound);
  });

  test('Matched and replaced.', ({}) => {
    action.search = "{C}";
    action.sound = "{C} matched";
    expect(actionResponse(player, line, action)).toEqual(player.toLowerCase() + " matched");
  });

  test('Not matched.', ({}) => {
    let line = "AnotherPlayer"
    action.search = "{C}";
    expect(actionResponse(player, line, action)).toEqual(false);
  });

  test('Multiple matches and replacements', ({}) => {
    let line = "TestPlayer tests out new Testplayer's test"
    action.search = "{C}";
    action.sound = "{C} tests out new {C}'s test"
    expect(actionResponse(player, line, action)).toEqual(line.toLowerCase());
  });

});

test.describe('Support for {S} matching in actions', () => {
  const player = "TestPlayer"; 
  let line = "a sentence match";
  let action = { type: "speak", key: "", search: "", sound: "", regex: true };

  test('{S} matched', ({}) => {
    action.search = "{S} match";
    action.sound = "matched";
    expect(actionResponse(player, line, action)).toEqual(action.sound);
  });

  test('Matching group cannot be have the same name, match fails.', ({}) => {
    action.search = "{S} match {S}";
    action.sound = "matched";
    expect(actionResponse(player, line, action)).toEqual(false);
  });

  test('{S} Group name case does not matter.', ({}) => {
    action.search = "{s} match";
    action.sound = "{S} matched";
    expect(actionResponse(player, line, action)).toEqual("a sentence matched");
    action.search = "{S} match";
    action.sound = "{s} matched";
    expect(actionResponse(player, line, action)).toEqual("a sentence matched");
  });

  test('Response can have multiple matching groups of the same name.', ({}) => {
    line = "a sentence match another sentence";
    action.search = "{s} match";
    action.sound = "{s} matched {s}";
    expect(actionResponse(player, line, action)).toEqual("a sentence matched a sentence");
  });

  test('Responses will includes {S} even if not matched. Gina does this.', ({}) => {
    line = "a sentence match another sentence";
    action.search = "match";
    action.sound = "{s} matched {s}";
    expect(actionResponse(player, line, action)).toEqual(action.sound);
  });

  test('Support multiple group names {S}, {Sd+}', ({}) => {
    line = "a sentence match another sentence";
    action.search = "{S0} match";
    action.sound = "{S0} matched";
    expect(actionResponse(player, line, action)).toEqual("a sentence matched");
    action.search = "{S9000} match";
    action.sound = "{S9000} matched";
    expect(actionResponse(player, line, action)).toEqual("a sentence matched");
  });

  test('Support many group matches.', ({}) => {
    line = "a sentence match another sentence";
    action.search = "{S} sentence {S1} another {S3}";
    action.sound = "{S} sentence {S1}ed another {S3}";
    expect(actionResponse(player, line, action)).toEqual("a sentence matched another sentence");
  });
    
});

test.describe('Support for {W} matching in actions', () => {
  const player = "TestPlayer"; 
  let line = "a sentence match";
  let action = { type: "speak", key: "", search: "", sound: "", regex: true };

  test('{W} matched', ({}) => {
    action.search = "a {W} match";
    action.sound = "matched";
    expect(actionResponse(player, line, action)).toEqual(action.sound);
  });

  test('{W} matched and replaced', ({}) => {
    action.search = "a {W} match";
    action.sound = "{W} matched";
    expect(actionResponse(player, line, action)).toEqual("sentence matched");
  });

});

test.describe('Real world examples', () => {
  const player = "tester"; 
  let line = "";
  let action = { type: "", key: "", search: "", sound: "", regex: true };

  test('Spell was interrupted', ({}) => {
    line = "Your spell is interrupted.";
    action.type = "speak";
    action.search = "Your spell is interrupted.";
    action.sound = "{C} Interrupted";
    expect(actionResponse(player, line, action)).toEqual("tester interrupted");
  });

  test('Gift of mana', ({}) => {
    line = "You've been granted a gift of gracious mana!";
    action.type = "speak";
    action.search = "You've been granted a gift of {S} mana!";
    action.sound = "Free cast for {C}";
    expect(actionResponse(player, line, action)).toEqual("free cast for tester");
  });

  test('Spell was resisted', ({}) => {
    line = "Your target resisted the Selo's Chords of Cessation spell";
    action.type = "speak";
    action.search = "Your target resisted the {S} spell";
    action.sound = "{S} cast by {C} was resisted";
    expect(actionResponse(player, line, action)).toEqual("selo's chords of cessation cast by tester was resisted");
  });

  test('Player invited to group', ({}) => {
    line = "Player invites you to join a group.";
    action.type = "speak";
    action.search = "{W} invites you to join a group";
    action.sound = "{W} invited {C} to group";
    expect(actionResponse(player, line, action)).toEqual("player invited tester to group");
  });

  test('Banshee', ({}) => {
    line = "a spiteful banshee turns her attention on Tester.";
    action.type = "speak";
    action.search = "a spiteful banshee turns her attention on {C}";
    action.sound = "{C} take Banshee to doors!";
    expect(actionResponse(player, line, action)).toEqual("tester take banshee to doors!");
  });

});
