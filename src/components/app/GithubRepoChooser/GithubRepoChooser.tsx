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
import { set } from 'zod';

export default function GithubRepoChooser(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [repos, setRepos] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    getRepos().then((response) => {
      if (response.success) {
        setRepos(response.repos!);
        setIsLoading(false);
      }
    });
    setValue(props.selected ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    props.onSelect(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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
          {/* TODO: refactor whatever this is. */}
          {isLoading
            ? 'Loading repositories (may take a while)...'
            : value.length > 0
            ? repos.find((repo) => repo === value)
            : repos.length === 0
            ? 'No repositories found'
            : 'Select a repository'}
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
                  key={repo}
                  value={repo}
                  onSelect={(currentValue) => {
                    console.log(currentValue, value);
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {repo}
                  <Check className={cn('ml-auto', value === repo ? 'opacity-100' : 'opacity-0')} />
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
  onSelect: (repo: string) => void;
  selected?: string;
}
