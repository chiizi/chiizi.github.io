/**
 * Simple Javascript Stack Machine
 *
 * This file contains an implementation of a simple stack machine in
 * Javascript.
 *
 * @author Samy Ascha
 */
String.prototype.ltrim = function () { return this.replace(/^\s*/,""); } 
String.prototype.rtrim = function () { return this.replace(/\s*$/,""); } 
String.prototype.trim  = function () { return this.ltrim().rtrim(); }

SJSSM.LABEL_MAIN = '__JSSM-MAIN__';
SJSSM.BOOL_TRUE  = 0xFFFFFFFF;
SJSSM.BOOL_FALSE = 0x0;
/**
 * Simple Javascript Stack Machine Class
 *
 * Contains all logic for the stack machine.
 */
function SJSSM() {
    var registers = { PC: 0, SP: -1, MP: undefined, RR: undefined, IR: undefined };
    var stack = [];
    var code = [];
    /**
     * Main Run Loop
     *
     * Runs code by fetching instructions at the program counter and
     * incrementing it.
     */
    this.run = function() {
        while(true) {
            if (!this.step(1)) break;
        }
    }
    /**
     * Step Machine
     *
     * Step the machine forward 1 execution.
     */
    this.step = function(steps) {
        if (steps == undefined) steps = 1;
        while(steps > 0) {
            steps--;
            try {
                // Check if we have an instruction at the PC, if not halt implicitly:
                if (code[registers.PC] == undefined) throw({err: 'IMPLICIT_HALT', detail: 'No code at PC. Machine halt.'});
                // Fetch the instruction at the PC:
                var instruction = code[registers.PC];
                // Record the current PC:
                var savePC = registers.PC;
                // Increment the PC:
                registers.PC++;
                // Check if the fetched instruction is defined. If so execute it:
                if (instruction.op in this) {
                    this[instruction.op](instruction.param);
                }
                // Else, raise an error:
                else {
                    throw({err: 'UNKNOWN_OPERATION', detail: 'Unknown operation ' + instruction.op + ' on line ' + savePC + '.'});
                }
                // TODO: move this info to some step analysis feature: console.debug('PC: ' + registers.PC + ', SP: ' + registers.SP + ', stack: ' + stack);
            }
            // Catch any errors during execution:
            catch(err) {
                // Implicit halt is fine, we just report:
                if (err.err == 'IMPLICIT_HALT') {
                    console.debug("HALT (implicit)");
                }
                // Explicit halt is fine, we just report:
                else if (err.err == 'EXPLICIT_HALT') {
                    console.debug("HALT (explicit)");
                }
                // Anything else is a real error! Report details:
                else {
                    alert('other error');
                    console.debug(err.err + ': ' + err.detail)
                }
                return false;
            }
        }
        return true;
    }
    /**
     * Program Machine
     *
     * Program the machine, by loading code into it.
     */
    this.program = function(src) {
        code = [];
        parse(src);
    }
    /**
     * Reset Machine
     *
     * Reset the machine by setting all registers to defult values, emptying
     * the stack and clearing all code.
     */
    this.reset = function() {
        registers = { PC: 0, SP: -1, MP: undefined, RR: undefined, IR: undefined };
        stack = [];
        code = [];
    }
    this.ldc = function(constant) {
        stack.push(constant);
        registers.SP++;
    }
    this.ldr = function(register) {
        stack.push(registers[register]);
        registers.SP++;
    }
    this.lds = function(spOffset) {
        stack.push(stack[registers.SP + spOffset]);
        registers.SP++;
    }
    this.ldl = function(mpOffset) {
        stack.push(stack[registers.MP + mpOffset]);
        registers.SP++;
    }
    this.str = function(register) {
        registers[register] = stack.pop();
        registers.SP--;
    }

    this.sts = function(spOffset) {
        stack[registers.SP + spOffset] = stack.pop();
        registers.SP--;
    }
    this.stl = function(mpOffset) {
        stack[registers.MP + mpOffset] = stack.pop();
        registers.SP--;
    }
    this.brt = function(label) {
        var test = stack.pop();
        registers.SP--;
        if (test == SJSSM.BOOL_TRUE) registers.PC = lookup(label);
    }
    this.brf = function(label) {
        var test = stack.pop();
        registers.SP--;
        if (test == SJSSM.BOOL_FALSE) registers.PC = lookup(label);
    }
    this.bra = function(label) {
        registers.PC = lookup(label);
    }
    this.bsr = function(label) {
        var next = registers.PC;
        stack.push(next);
        registers.SP++;
        registers.PC = lookup(label);
    }
    this.ret = function() {
        var pc = stack.pop();
        registers.SP--;
        registers.PC = pc;
    }
    this.link = function(numLocals) {
        if (numLocals == undefined) numLocals = 0;
        // Store MP on stack:
        stack.push(registers.MP);
        registers.SP++;
        // Set the new MP:
        registers.MP = stack.length - 1;
        // Save space for local variables:
        for(var i = 0; i < numLocals; i++) {
            stack.push(undefined);
            registers.SP++;
        }
    }
    this.unlink = function(numLocals) {
        if (numLocals == undefined) numLocals = 0;
        // Remove local variables:
        for(var i = 0; i < numLocals; i++) {
            stack.pop();
            registers.SP--;
        }
        // Restore old MP:
        registers.MP = stack.pop();
        registers.SP--;
    }
    this.ajs = function(spAdjustment) {
        if (spAdjustment > 0) {
            for(var i = 0; i < spAdjustment; i++) {
                stack.push(undefined);
                registers.SP++;
            }
        }
        else {
            for(var i = 0; spAdjustment < i; i--) {
                stack.pop();
                registers.SP--;
            }
        }
    }
    this.halt = function halt() {
        throw({err: 'EXPLICIT_HALT', detail: 'Machine halted by halt instruction'});
    }
    this.add = function() {
        var b = stack.pop();
        var a = stack.pop();
        stack.push(a + b);
        registers.SP--;
    }
    this.sub = function() {
        var b = stack.pop();
        var a = stack.pop();
        stack.push(a - b);
        registers.SP--;
    }
    this.mul = function() {
        var b = stack.pop();
        var a = stack.pop();
        stack.push(a * b);
        registers.SP--;
    }
    this.div = function() {
        var b = stack.pop();
        var a = stack.pop();
        stack.push(a / b);
        registers.SP--;
    }
    this.mod = function() {
        var b = stack.pop();
        var a = stack.pop();
        stack.push(a % b);
        registers.SP--;
    }
    this.neg = function() {
        var a = stack.pop();
        stack.push(-a);
    }
    this.eq  = function() {
        stack.push(stack.pop() == stack.pop() ? SJSSM.BOOL_TRUE : SJSSM.BOOL_FALSE); 
        registers.SP--;
    }
    this.ne  = function() {
        stack.push(stack.pop() != stack.pop() ? SJSSM.BOOL_TRUE : SJSSM.BOOL_FALSE); 
        registers.SP--;
    }
    this.lt = function() {
        stack.push(stack.pop() > stack.pop() ? SJSSM.BOOL_TRUE : SJSSM.BOOL_FALSE); 
        registers.SP--;
    }
    this.gt = function() {
        stack.push(stack.pop() < stack.pop() ? SJSSM.BOOL_TRUE : SJSSM.BOOL_FALSE); 
        registers.SP--;
    }
    this.le = function() {
        stack.push(stack.pop() >= stack.pop() ? SJSSM.BOOL_TRUE : SJSSM.BOOL_FALSE); 
        registers.SP--;
    }
    this.ge = function() {
        stack.push(stack.pop() <= stack.pop() ? SJSSM.BOOL_TRUE : SJSSM.BOOL_FALSE); 
        registers.SP--;
    }
    this.getRegisters = function() {
        return registers;
    }
    this.getStack = function() {
        return stack;
    }
    this.getStackExtra = function() {
        var ret = [];
        for (var i in stack) {
            var num = stack[i];
            if (num == undefined) {
                ret.push({'dec': num, 'hex': num, 'bin': num});
            }
            else {
                bin = '0000000000000000' + num.toString(2);
                hex = '0x' + num.toString(16).toUpperCase();
                ret.push({'dec': num, 'hex': hex, 'bin': bin.substring(bin.length - 16)});
            }
        }
        return ret;
    }
    this.getCode = function() {
        return code;
    }
    function lookup(label) {
        if (label == SJSSM.LABEL_MAIN) return 0;
        for(var i = 0; i < code.length; i++) {
            if (code[i].label == label) {
                return i;
            }
        }
        throw({err: 'LABEL_NOT_FOUND', detail: 'Label ' + label + ' not found'});
    }
    function parse(src) {
        var lines = src.split("\n");
        for(var i in lines) {
            if (lines[i].trim() == '') continue;
            var matches = lines[i].match(/^(\s*[a-zA-Z0-9_-]+\s*:)?\s*([a-zA-Z0-9]+)?\s*([0-9a-zA-Z_-]+)?\s*(\/\/.*)?$/);
            if (!matches) throw({err: 'PARSE_ERROR', detail: 'Parse error on line ' + (i + 1) + ': ' + lines[i]});
            // Show the code loaded into the machine in the console:
            console.debug(matches[0]);
            var instruction = {
                label  : (matches[1]) ? matches[1].trim().replace(/:$/, "") : undefined,
                op     : matches[2].trim().toLowerCase(), // relax case-sensitivity for ops
                param  : (matches[3]) ? (isNaN(matches[3])) ? matches[3].trim() : parseInt(matches[3]) : undefined,
                comment: (matches[4]) ? matches[4].trim().replace(/^\/\//, "").trim() : undefined
            }
            code.push(instruction);
        }
    }
}
