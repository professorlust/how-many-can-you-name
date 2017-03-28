var quizzer = {
    correct_count: 0,
    correct: new Array(),
    answer_key: new Array(),
    answer_key_merged: new Array(),
    answer_times: new Array(),
    split_answer: new Array(),
    answer_count: 0,
    mins: 0,
    secs: 0,
    time_on_current_answer: 0,
    config: 
    { 
        has_photos: 0,
        log_answers: 0,
    },
    update_config: function(config) {
        // Take an external config object and update this config object.
        for ( var key in config )
        {
            if ( config.hasOwnProperty(key) )
            {
                this.config[key] = config[key];
            }
        }
    },
    time_count: function() 
    {
        // Count down.
        this.mins = 1 * this.min_count($('#time_limit').attr('value'));
        this.secs = 0 + this.sec_count(":01");
        this.counter();
    },
    min_count: function(input) 
    {
        // Pull out the minutes part of a time string, as in the "1" part of, say, "1:30"
        var len = input.length;

        for( var i = 0; i < len; i++ ) if( input.substring(i, i + 1) == ":" ) break;

        return input.substring(0, i);
    },
    sec_count: function(input) 
    {
        // Pull out the seconds part of a time string, as in the "30" part of, say, "1:30"
        var len = input.length;

        for( var i = 0; i < len; i++ ) if( input.substring(i, i + 1) == ":" ) break;

        return input.substring(i + 1, input.length);
    },
    counter: function() 
    {
        // Deal with the passage of time.
        if( this.correct_count == this.answer_key.length ) return;
        this.time_on_current_answer++;
        this.secs--;
        if( this.secs == -1 ) 
        {
            this.secs = 59;
            this.mins--;

            // This situation happens if we end a game early.
            if ( this.mins < 0 )
            {
                this.mins = 0;
                this.secs = 0;
            }
        }
        document.time_count.timer.value = this.display_time(this.mins,this.secs);

        if( this.mins == 0 && this.secs == 0 && this.alerted == 0 ) 
        {
            this.alerted = 1;
            window.alert("Time up."); 
            this.show_answers(); 
        } 
        else 
        {
            cd = setTimeout("quizzer.counter()", 1000);
        }
    },
    display_time: function(mins,secs) 
    {
        // Format a string so we can show readers how much time they have left.
        var display;

        if( mins <= 9 ) display = " 0";
        else display = " ";

        display += mins + ":";

        if( secs <= 9 ) display += "0" + secs;
        else display += secs;

        return display;
    },
    quit: function()
    {
        // Sometimes games end early.
        $('#end-it').remove();
        this.secs = 1;
        this.mins = 0;
        this.counter();
        return false;
    },
    alerted: 0,
    find_in_array: function(value, array)
    {
        // Loop through an array, if a string is found in the array then 
        // return the index of the array item found.
        // Otherwise, return -1.
        var len = array.length;
        for ( var i = 0; i < len; i++ )
        {
            if ( array[i].indexOf(value) !== -1 ) return i;
        }
        return -1;
    },
    is_true_in_array: function(value, array)
    {
        // The boolean version of find_in_array.
        if ( this.find_in_array(value, array) === -1 ) return false;
        return true;
    },
    check_answer: function(input)
    {
        // Take the current value of the input field people type their answers into.
        // If there's something in that field, and it matches any of the strings
        // remaining in the answer_key array, we have a new, correct answer.

        if ( input.value.length > 0 )
        {
            for ( var i = 0; i < this.answer_key_merged.length; i++ )
            {
                if ( input.value.toLowerCase() == this.answer_key_merged[i].toLowerCase() )
                {
                    this.time_on_current_answer = 0;
                    var answer = this.answer_key_merged[i]
                    this.correct.push(answer)
                    this.correct.sort();
                    this.answer_key_merged.splice(i,1);

                    // See if the correct answer was one of the split answers and 
                    // if so, remove it from answer_key too.
                    if ( this.find_in_array(answer, this.split_answer) > -1 )
                    {
                        // It's a splitter, so find it in the answer_key, remove it from answer_key,
                        // and remove its partner from answer_key_merged
                        var splitter_in_main_key = this.find_in_array(answer, this.answer_key);
                        var other_split = this.answer_key[splitter_in_main_key].replace(answer, '').replace('/', '').trim();
                        var other_index = this.answer_key_merged.indexOf(other_split);
                        
                        // Clean up answer_key and answer_key_merged
                        this.answer_key_merged.splice(other_index, 1);
                        this.answer_key.splice(splitter_in_main_key, 1);
                
                    }
                    else
                    {
                        // It's not a splitter, so just find it in answer_key
                        // and remove it.
                        var j = this.answer_key.indexOf(answer);
                        console.log(j, answer);
                        this.answer_key.splice(j,1);
                    }
                    input.value = "";
                    this.correct_count++;
                    var msg = "";
                    var len_correct = this.correct.length;
                    this.answer_times[len_correct] = (this.mins * 60) + this.secs;
                    for ( var x=0; x < len_correct; x++ ) msg += this.correct[x]+", ";
        
                    $("#correct").html(msg);
                    var remainmsg = " remain";
                    
                    $("#remain").text( (this.answer_count - this.correct_count) + remainmsg );
                    if ( this.correct_count == this.answer_count ) window.alert("You win!"); 
                    return;
                }
            }
            // SEND HELP'ER
            if ( input.value.length > 2 )
            {
                // If they don't have a right answer yet, check to make sure they're
                // on the right track, and if not, color the text red.
                var all_wrong = 1;
                for ( var i = 0; i < this.answer_key.length; i++ )
                {
                    var c = input.value.toLowerCase();
                    if ( this.answer_key[i].toLowerCase().indexOf(c) === 0 )
                    {
                        all_wrong = 0;
                    }
                }
                if ( all_wrong == 1 ) $('input#answer').addClass('wrong');
                else $('input#answer').removeClass('wrong');
            }
            else $('input#answer').removeClass('wrong');
        }
        else
        {
            if( input.value == " " ) input.value = "";
        }
    },
    show_answers: function()
    {
        var len = this.answer_key.length;
        var msg = '<h3>Missed:</h3><p>';
        for( var x=0; x < len; x++ ) msg += this.answer_key[x]+", ";
        msg += '</p>';

        $("#missed").html(msg);
        $("#missed").css('display','block');
        $("#explanation").css('display', 'block');
    },
    start: function()
    {
        // Start the quiz timer and show the quiz interface elements.
        $('#start-it').remove();
        $('#quiz_interface').removeClass('hide');
        //this.counter();
        this.time_count();
        document.getElementById('answer').focus();
    },
    init: function() 
    {
        // Populate the answers, figure out how many answers the reader
        // has to get right, set the config.

        // Config handling. External config objects must be named quiz_config
        if ( typeof window.quiz_config !== 'undefined' ) { this.update_config(mapg_config); }

        var all_answers = $('#answer_key').attr('value');
        this.answer_key = all_answers.split(',');
        this.answer_count = this.answer_key.length;

        // SPLIT ANSWWER
        // Check if we need to handle a "split" answer -- where a single option
        // has more than one answer.
        if ( all_answers.indexOf('/') !== -1 )
        {
            // Pull the answers that are split.
            // We know that slashes would *never* be in an answer for any other
            // reason than the answer needs to be split. We know this.
            var splitters = this.answer_key.filter(/./.test, /\//);
            var len = splitters.length;
            for ( var i = 0; i < len; i ++ )
            {
                var s = this.answer_key.indexOf(splitters[i]);
                var a = this.answer_key[s];
                var answers = a.split('/');
                this.split_answer.push(answers[0].trim())
                this.split_answer.push(answers[1].trim())
            }
        }
        this.answer_key_merged = this.answer_key.concat(this.split_answer);
       
    }
}

$(document).ready(function(){ quizzer.init(); });

function slugify(text) {
    // from https://gist.github.com/mathewbyrne/1280286
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}