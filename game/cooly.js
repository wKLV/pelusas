var COOLY = function(parameters, time){
    if(typeof parameters === "undefined") parameters = {hability:"none"}
    this.hability = parameters.hability;
    this.velocity = 5;
    this.time = time;
    var fill = "assets/pelusa.png";
    switch (this.hability){
        case "none": fill = "assets/pelusa.svg"; break;
        case "heavy": fill = "assets/pelusa-heavy.png"; break;
    }
	this.createVisual = function(){
		return new Sprite("pelusanone").size(60, 60);
	}
}

var COOLYEMITTER = function(parameters){
    this.sequence ={}, this.position = parameters.position, this.i = {i: 0};
    var steps = 0, coolies = 0;
    $.extend(true, this.sequence, parameters.sequence);
    var i = this.i;
    /*var r = false;
    function nextsequence(sequence){
        function deploy(sequence,many, time, finished){ return function(){
            if(i.i > 25) i.i = 25;
            if(sequence instanceof Array){
                deploy(sequence[0].cooly, sequence[0].many, sequence[0].time, finished)()
            }
            else if(sequence.hability){
                r = new COOLY(sequence)
                if(many <= 0)
                    finished();
                else{
                    setTimeout(deploy(sequence, many-1, time, finished),(time -2500 *(Math.atan(2*i.i-50)+Math.atan(50)))/speed);
                    i.i++;
                }
            }
        }}
        sequence.finished = function(){
            if(sequence.many <=1) return;
            if(sequence.cooly instanceof Array){
                var seq = sequence.cooly.splice(0,1);
	        sequence.cooly = sequence.cooly.concat(seq);
                sequence.many --;
                deploy(sequence.cooly, sequence.many, sequence.time, sequence.finished)();

            }
        }
        setTimeout(deploy(sequence.cooly, sequence.many, sequence.time , sequence.finished), sequence.time);
    }
    nextsequence(this.sequence)
*/
    function iterateSequence(sequence){
        function repeatArray(count, arr){
		  var ln = arr.length;
		  var b = new Array();
		  for(i=0; i<count*ln; i++) {
		    b.push(arr[i%ln]);
		  }
	  	return b;
	}
	if(sequence.cooly.hability){
	    return repeatArray(sequence.many,[new COOLY(sequence.cooly, sequence.time)]);
	}
        else if (sequence.cooly instanceof Array){
	    var list = [];
	    $.each(sequence.cooly, function(i,v){
		list = list.concat(iterateSequence(v));
	    });
            list.push({none:true, time:sequence.time});
	    return repeatArray(sequence.many, list);
	}
        else{
            var list = iterateSequence(sequence.cooly);
            list.splice(0,0).push({none:true, time:sequence.time});
	    return repeatArray(sequence.many, list);
        }
    }
    this.sequence = iterateSequence(this.sequence);
    var needsteps = this.sequence[0].time;
            needsteps -= 2500 *(Math.atan(2*this.i.i-30)+Math.atan(30))
	    needsteps /= Step;
    this.getNext = function(){
	steps++;
	if(steps >= needsteps){
                var c = this.sequence[coolies];
		if(c){
                steps = 0;
                needsteps = (c.time -2500 *(Math.atan(2*this.i.i-30)+Math.atan(30)))/Step
		coolies ++; if(this.i.i<15) this.i.i ++;
			return c
		}
		else return {end:true};
        }
	else return false;
    }
	this.visual = new Sprite("in").size(150, 150);
}
