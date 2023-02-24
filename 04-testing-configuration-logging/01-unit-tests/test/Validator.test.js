const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 18,
          max: 27,
        },
      });

      const errorsMin = validator.validate({ name: 'lala' });
      const errorsMax = validator.validate({ name: 'LalalalalalalalalalaLalalalalalalalalalaLalalalalalalalalala' });
      const noErrors = validator.validate({ name: 'Lalalalalalalalalala' });

      expect(errorsMin).to.have.length(1);
      expect(errorsMax).to.have.length(1);
      expect(noErrors).to.have.length(0);

      expect(errorsMin[0]).to.have.property('field').and.to.be.equal('name');
      expect(errorsMin[0]).to.have.property('error').and.to.be.equal('too short, expect 18, got 4');
      expect(errorsMax[0]).to.have.property('field').and.to.be.equal('name');
      expect(errorsMax[0]).to.have.property('error').and.to.be.equal('too long, expect 27, got 60');

    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10,
        },
      });

      const errorsMin = validator.validate({ age: 4 });
      const errorsMax = validator.validate({ age: 11 });
      const noErrors = validator.validate({ age: 7 });

      expect(errorsMin).to.have.length(1);
      expect(noErrors).to.have.length(0);
      expect(errorsMax).to.have.length(1);

      expect(errorsMin[0]).to.have.property('field').and.to.be.equal('age');
      expect(errorsMin[0]).to.have.property('error').and.to.be.equal('too little, expect 5, got 4');
      expect(errorsMax[0]).to.have.property('field').and.to.be.equal('age');
      expect(errorsMax[0]).to.have.property('error').and.to.be.equal('too big, expect 10, got 11');
    });

    it('валидатор проверяет числовые/строковые поля с неправильно переданным типом параметра', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10,
        },
        name: {
          type: 'string',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({ age: 'a', name: 1});

      expect(errors).to.have.length(2);

      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      expect(errors[1]).to.have.property('field').and.to.be.equal('name');
      expect(errors[1]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    it('валидатор проверяет непереданное при создании instance поле', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({ age: 20 });

      expect(errors).to.have.length(1);

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('did not get the name field');
    });

    it('валидатор проверяет c незаданным при создании instance min ограничением', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          max: 27,
        },
      });

      const errors = validator.validate({ name: 'bababababbababababa' });

      expect(errors).to.have.length(1);

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('did not get the min filter');
    });

    it('валидатор проверяет c незаданным при создании instance max ограничением', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 18,
        },
      });

      const errors = validator.validate({ name: 'bababababbababa' });

      expect(errors).to.have.length(1);

      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('did not get the max filter');
    });
  });
});