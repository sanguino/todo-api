import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { checkId, checkIdAndText, checkIdAndCompleted } from '../../lib/utils/validateRequest';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('validators', () => {
  describe('checkId', () => {
    it('should validate correct object', () => expect(checkId('23')).to.be.fulfilled);

    it('should not validate empty id', () => expect(checkId('')).to.be.rejected);

    it('should not validate undefined id', () => expect(checkId()).to.be.rejected);
  });

  describe('checkIdAndText', () => {
    it('should validate correct object', () =>
      expect(checkIdAndText({ id: '1', text: 'buy milk' })).to.be.fulfilled);

    it('should not validate if text not been set', () =>
      expect(checkIdAndText({ id: '1' })).to.be.rejectedWith('validation handler: bad data'));

    it('should not validate if id not been set', () =>
      expect(checkIdAndText({ text: 'text' })).to.be.rejectedWith('validation handler: bad data'));

    it('should not validate if text and id not been set', () =>
      expect(checkIdAndText({})).to.be.rejectedWith('validation handler: bad data'));

    it('should not validate no params set', () =>
      expect(checkIdAndText()).to.be.rejectedWith('validation handler: bad data'));
  });

  describe('checkIdAndText', () => {
    it('should validate correct object', () =>
      expect(checkIdAndCompleted('1', { completed: true })).to.be.fulfilled);

    it('should not validate if completed not been set', () =>
      expect(checkIdAndText('1', {})).to.be.rejectedWith('validation handler: bad data'));

    it('should not validate if id not been set', () =>
      expect(checkIdAndText('', { completed: true })).to.be.rejectedWith(
        'validation handler: bad data',
      ));

    it('should not validate no params set', () =>
      expect(checkIdAndText()).to.be.rejectedWith('validation handler: bad data'));
  });
});
