import { deepFind } from '@vms/shared/utils';
import {
  DTOMapper,
  MapFrom,
  MappedDto,
  ValueMappingFailedError,
} from './base-dto-mapper';

class SimpleMappingDto extends DTOMapper {
  @MapFrom()
  prop: any;
}
describe(`Test BaseDTOMapper.ts`, () => {
  describe(`Function deepFind`, () => {
    it(`Should return property`, () => {
      const obj: any = {
        name: {
          first: `Cobby`,
          last: `Do`,
        },
      };
      const current = deepFind(obj, `name.first`);
      expect(current).toBe(`Cobby`);
    });

    it(`Should return undefined`, () => {
      const obj: any = {
        name: {
          last: `Hiep`,
        },
      };
      const current = deepFind(obj, `name.first`);
      expect(current).toBeUndefined();
    });
  });

  describe(`Class ValueMappingFailedError`, () => {
    it(`Should return error instance`, () => {
      const err = new ValueMappingFailedError(`reason`);
      expect(err).toBeInstanceOf(ValueMappingFailedError);
    });
  });

  describe(`Class DTOMapper`, () => {
    it(`Should construct without parameter`, () => {
      const dto = new SimpleMappingDto();
      expect(dto).toBeInstanceOf(SimpleMappingDto);
    });

    it(`Should construct with empty parameter`, () => {
      const dto = new SimpleMappingDto({});
      expect(dto).toBeInstanceOf(SimpleMappingDto);
    });

    it(`Should construct with valid parameter`, () => {
      const dto = new SimpleMappingDto({ prop: 1 });
      expect(dto).toEqual({ prop: 1 });
    });

    it(`Should construct with object and multi value parameter`, () => {
      class Test extends DTOMapper {
        @MapFrom(
          () => ({ first: `first`, second: `second` }),
          undefined,
          true,
          `x`
        )
        prop: string;
      }
      const dto = new Test({ prop: `he` });

      expect(dto).toBeDefined();
    });

    it(`Should construct with array and multi value parameter`, () => {
      class Test extends DTOMapper {
        @MapFrom(() => [1, 2], undefined, true, `x`)
        prop: string;
      }
      const dto = new Test({ prop: `he` });

      expect(dto).toBeDefined();
    });

    it(`Should construct with multi value parameter`, () => {
      class Test extends DTOMapper {
        @MapFrom(() => undefined, undefined, true, `x`)
        prop: string;
      }
      const dto = new Test({ prop: `he` });

      expect(dto).toBeDefined();
    });

    it(`Should construct with empty object as default value`, () => {
      class Test extends DTOMapper {
        @MapFrom(() => undefined, undefined, true, {})
        prop: string;
      }
      const dto = new Test({ prop: `he` });

      expect(dto).toBeDefined();
    });

    it(`Should return class instance with decorator`, () => {
      @MappedDto
      class Test {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        constructor(source: any) {}
        @MapFrom()
        prop: string;
      }
      const dto = new Test({ prop: 'x' });

      expect(dto).toBeDefined();
    });
  });
});
