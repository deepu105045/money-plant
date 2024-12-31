export const capitalizeFirstLetter = (obj: any) => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (typeof value === 'string' && value.length > 0) {
          return [key, value.charAt(0).toUpperCase() + value.slice(1)];
        }
        return [key, value];
      })
    );
  };

