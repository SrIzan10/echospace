/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getRepos } from './getRepos';

export default function GithubRepoChooser(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [repos, setRepos] = React.useState<{ name: string, installationId: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [displayText, setDisplayText] = React.useState('Select a repository');

  React.useEffect(() => {
    setIsLoading(true);
    getRepos().then((response) => {
      if (response.success) {
        setRepos(response.repos!);
        setIsLoading(false);
        if (props.selected) {
          setValue(props.selected);
        }
      }
    });
  }, []);
  React.useEffect(() => {
    if (isLoading || !value) return;
    const repo = repos.find((repo) => repo.name === value);
    if (repo) {
      props.onSelect(value, repo.installationId);
    }
  }, [value, repos, isLoading, props.onSelect]);
  React.useEffect(() => {
    if (value.length > 0 && !isLoading) {
      setDisplayText(repos.find((repo) => repo.name === value)!.name);
    } else if (repos.length === 0) {
      setDisplayText('No repositories found');
    } else {
      setDisplayText('Select a repository');
    }
  }, [value, repos]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={repos.length === 0}
        >
          {isLoading ? 'Loading...' : displayText}
          <ChevronsUpDown className="opacity-50 w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" side="bottom">
        <Command>
          <CommandInput placeholder="Search repository..." />
          <CommandList>
            <CommandEmpty>No repos found.</CommandEmpty>
            <CommandGroup>
              {repos.map((repo) => (
                <CommandItem
                  key={repo.name}
                  value={repo.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  {repo.name}
                  <Check className={cn('ml-auto', value === repo.name ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface Props {
  onSelect: (repo: string, installationId: string) => void;
  selected?: string;
}
