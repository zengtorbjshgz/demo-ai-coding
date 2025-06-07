import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import SideNav from '../SideNav.vue';

describe('SideNav.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(SideNav);
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('has MENU and GENERAL sections', () => {
    const sections = wrapper.findAll('.section-title');
    expect(sections.length).toBe(2);
    expect(sections[0].text()).toBe('MENU');
    expect(sections[1].text()).toBe('GENERAL');
  });

  it('sets Dashboard as the default active item', () => {
    const activeItem = wrapper.find('li.active .item-content span');
    expect(activeItem.exists()).toBe(true);
    expect(activeItem.text()).toBe('Dashboard');
    const indicator = wrapper.find('li.active .indicator');
    expect(indicator.exists()).toBe(true);
  });

  it('changes active item on click', async () => {
    const listItems = wrapper.findAll('li');
    const myAssetLi = listItems.find((li: any) => li.text().includes('My Asset'));
    
    if (myAssetLi) {
      await myAssetLi.trigger('click');
      
      const activeItem = wrapper.find('li.active .item-content span');
      expect(activeItem.exists()).toBe(true);
      expect(activeItem.text()).toBe('My Asset');
      const indicator = wrapper.find('li.active .indicator');
      expect(indicator.exists()).toBe(true);
    }
  });

  it('renders all menu items', () => {
    const menuItems = wrapper.findAll('.menu-section li');
    expect(menuItems.length).toBe(5);
    const menuItemTexts = menuItems.map((item: any) => item.find('.item-content span').text());
    expect(menuItemTexts).toEqual(['Dashboard', 'My Asset', 'Analytics', 'History', 'News']);
  });

  it('renders all general items', () => {
    const generalItems = wrapper.findAll('.general-section li');
    expect(generalItems.length).toBe(3);
    const generalItemTexts = generalItems.map((item: any) => item.find('.item-content span').text());
    expect(generalItemTexts).toEqual(['Help', 'Settings', 'Logout']);
  });

  it('displays an indicator for the active item only', async () => {
    let activeIndicators = wrapper.findAll('li.active .indicator');
    expect(activeIndicators.length).toBe(1);

    const analyticsLi = wrapper.findAll('li').find((li: any) => li.text().includes('Analytics'));
    
    if (analyticsLi) {
      await analyticsLi.trigger('click');
      
      activeIndicators = wrapper.findAll('li.active .indicator');
      expect(activeIndicators.length).toBe(1);
      const activeItemText = wrapper.find('li.active .item-content span').text();
      expect(activeItemText).toBe('Analytics');
    }
  });
});