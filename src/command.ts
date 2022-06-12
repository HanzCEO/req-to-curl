export class Command {
	flags: Record<string, boolean> = {};
	// XXX: any should not be used
	options: Record<string, any> = {};
	args: string[] = [];

	// XXX: any should not be used
	add_option(name: string, value: any) {
		this.options[name] = value;
	}

	// XXX: any should not be used
	get_option(name: string): any {
		return this.options[name];
	}

	remove_option(name: string) {
		delete this.options[name];
	}

	enable_flag(name: string) {
		this.flags[name] = true;
	}

	disable_flag(name: string) {
		this.flags[name] = false;
	}

	toggle_flag(name: string): boolean {
		this.flags[name] = !this.flags[name];
		return this.flags[name];
	}

	add_flag(name: string) {
		this.enable_flag(name);
	}

	add_arg(arg: string) {
		this.args.push(arg);
	}

	compileOptions(): string[] {
		let retval: string[] = [];
		for (const key in this.options) {
			retval.push(`${key} ${this.options[key]}`);
		}
		return retval;
	}

	compileFlags(): string[] {
		let retval: string[] = [];
		for (const key in this.flags) {
			if (this.flags[key]) {
				retval.push(key);
			}
		}
		return retval;
	}

	toString(): string {
		return ['curl', ...this.compileFlags(), ...this.compileOptions(), ...this.args].join(' ');
	}
};
