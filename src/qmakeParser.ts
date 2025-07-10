export class QMakeParser {
  parse(content: string): any {
    const config: any = {};
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || !trimmed) continue;

      // Handle variable assignments
      const assignMatch = trimmed.match(/^(\w+)\s*([+\-]?=)\s*(.*)$/);
      if (assignMatch) {
        const [, variable, operator, value] = assignMatch;
        this.processAssignment(config, variable, operator, value);
      }

      // Handle include statements
      const includeMatch = trimmed.match(/^include\s*\(\s*(.+)\s*\)$/);
      if (includeMatch) {
        config.INCLUDES = config.INCLUDES || [];
        config.INCLUDES.push(includeMatch[1]);
      }
    }

    return config;
  }

  private processAssignment(
      config: any, variable: string, operator: string, value: string) {
    const cleanValue = value.replace(/\\/g, '').trim();
    const values = this.parseValue(cleanValue);

    switch (operator) {
      case '=':
        config[variable] = values;
        break;
      case '+=':
        config[variable] = config[variable] || [];
        config[variable].push(...values);
        break;
      case '-=':
        if (config[variable]) {
          config[variable] =
              config[variable].filter((v: string) => !values.includes(v));
        }
        break;
    }
  }

  private parseValue(value: string): string[] {
    // Handle multi-line values and space-separated values
    return value.split(/\s+/).filter(v => v.length > 0);
  }
}