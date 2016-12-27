%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                       INITIALIZE                                                      %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% -------------------------------------------------------------------------------------------------------
% Inicializa o tabuleiro baseado no n�mero de jogadores introduzido.
% -------------------------------------------------------------------------------------------------------
initializeBoard(N_Players, Board):-
	write('Enter number of players [2-4]:'),
	read(N_input),
	getBoard(N_Players, N_input, Board).

% -------------------------------------------------------------------------------------------------------
% Cria a lista de listas correspondente ao tabuleiro de acordo com o numero de jogadores.
% No caso de o valor introduzido n�o existir chama 'initializeBoard' para reintroduzir um valor.
% -------------------------------------------------------------------------------------------------------
getBoard(2, 2,[ [ [], [1,m,v], [2,m,v], [1,m,v], [1,m,v], [2,m,v], [1,m,v], [] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h] ],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h] ],
	[ [], [1,m,v], [2,m,v], [1,m,v], [1,m,v], [2,m,v], [1,m,v], [] ] ]).
getBoard(3, 3,[[[],[1,m,v],[2,m,v],[3,m,v],[1,m,v],[2,m,v],[3,m,v],[]],
	[ [3,m,h], [], [], [], [], [], [], [3,m,h]],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h]],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h]],
	[ [3,m,h], [], [], [], [], [], [], [3,m,h]],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h]],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h]],
	[[],[1,m,v],[2,m,v],[3,m,v],[1,m,v],[2,m,v],[3,m,v],[]]]).
getBoard(4, 4,[[[],[1,m,v],[2,m,v],[3,m,v],[4,m,v],[1,m,v],[2,m,v],[]],
	[ [3,m,h], [], [], [], [], [], [], [3,m,h]],
	[ [4,m,h], [], [], [], [], [], [], [4,m,h]],
	[ [1,m,h], [], [], [], [], [], [], [1,m,h]],
	[ [2,m,h], [], [], [], [], [], [], [2,m,h]],
	[ [3,m,h], [], [], [], [], [], [], [3,m,h]],
	[ [4,m,h], [], [], [], [], [], [], [4,m,h]],
	[[],[1,m,v],[2,m,v],[3,m,v],[4,m,v],[1,m,v],[2,m,v],[]]]).
getBoard(4, test1,[[[],[],[2,'M',v],[],[],[],[],[]],
	[ [3,m,v], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], [4,'M',h]],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[[],[],[2,'M',v],[],[],[],[2,m,v],[]]]).
getBoard(2, test2,[[[],[],[],[],[],[],[],[]],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[ [1,m,h], [1,m,h], [1,m,h], [1,m,h], [1,m,h], [1,m,h], [1,m,h], [1,m,h]],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[[],[],[2,'M',v],[],[],[],[],[]]]).
getBoard(4, test3,[[[],[],[],[],[2,'M',v],[],[],[]],
	[ [], [], [], [], [], [], [], [3,'M',v]],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[ [1,'M',h], [], [], [], [4,m,h], [], [], [4,m,h]],
	[ [], [], [], [], [], [], [], []],
	[ [], [], [], [], [], [], [], []],
	[[],[],[],[],[],[],[],[]]]).
getBoard(N_Players, _, Board):-
	write('Invalid number of players.'), nl, !,
	initializeBoard(N_Players, Board).

% -------------------------------------------------------------------------------------------------------
% Inicializa o tipo de cada jogador (humano ou computador) e insere os dados numa lista.
% -------------------------------------------------------------------------------------------------------
initializeAI(N_Players, Players):-
	write('Choose human and computer players.'), nl,
	initializeAI(1, N_Players, [], Players).
initializeAI(Player, N_Players, Players_1, Players):-
	Player > N_Players,
	!,
	Players = Players_1.
initializeAI(Player, N_Players, Players_0, Players):-
	inputIA(Player, Players_0, Players_1),
	Player1 is Player + 1,
	initializeAI(Player1, N_Players, Players_1, Players).

% -------------------------------------------------------------------------------------------------------	
% Predicado auxiliar de 'initializeAI' que verifica se o input � valido e acrescenta valor � lista.
% A lista com os tipos de jogador tamb�m cont�m a ordem pela qual os jogadores promovem o seu primeiro
% minion a master (valores inicializados com 9).
% -------------------------------------------------------------------------------------------------------
inputIA(Player, Players_0, Players_1):-
	write('Player '), write(Player), write('?'), write('[human or pc]'),
	read(IA_input),
	inputIA(Player, Players_0, Players_1, IA_input).
inputIA(_, Players_0, Players_1, human):-
	append(Players_0, [[human,9]], Players_1).
inputIA(_, Players_0, Players_1, pc):-
	append(Players_0, [[computer,9]], Players_1).
inputIA(Player, Players_0, Players_1, _):-
	write('Invalid option [human or pc]. Try again'), nl,
	inputIA(Player, Players_0, Players_1).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                             DISPLAY                                                   %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% -------------------------------------------------------------------------------------------------------
% Chama os predicados de visualiza��o sobre a lista correspondente ao tabuleiro.
% -------------------------------------------------------------------------------------------------------
display_game(Board):- printboard(Board,w).

% -------------------------------------------------------------------------------------------------------
% Imprime o estado do tabuleiro linha a linha recursivamente usando os predicados auxiliares
% printlinetop, printlinemiddle e printlinebottom.
% -------------------------------------------------------------------------------------------------------
printboard([C|R],w):-
	write('   - - - - - - - - - - - - - - - - - - - - - - - -'),
	nl,
	write('  '),
	printlinetop(C,w), 
	nl,
	length([C|R],RW),
	write(RW),
	write(' '),
	printlinemiddle(C,w), 
	nl,
	write('  '),
	printlinebottom(C,w),
	nl,
	printboard(R,b).
printboard([C|R],b):-
	write('   - - - - - - - - - - - - - - - - - - - - - - - -'),
	nl,
	write('  '),
	printlinetop(C,b),
	nl,
	length([C|R],RW),
	write(RW),
	write(' '),
	printlinemiddle(C,b), 
	nl,
	write('  '),
	printlinebottom(C,b),
	nl,
	printboard(R,w).
printboard([], _):-
	write('   - - - - - - - - - - - - - - - - - - - - - - - -'),
	nl,
	write('     A     B     C     D     E     F     G     H'),
	nl,
	nl.

% -------------------------------------------------------------------------------------------------------
% Cada linha do tabuleiro � representada em 3 linhas de texto. Para cada uma destas linhas � utilizado
% um predicado diferente que l� e imprime recursivamente a lista correspondente � linha do tabuleiro.
% Utilizam os predicados auxiliares printsquaretop, printsquaremiddle e printsquarebottom.
% -------------------------------------------------------------------------------------------------------
printlinetop([C|R],w):-
	printsquaretop(C,w),
	printlinetop(R,b).
printlinetop([C|R],b):-
	printsquaretop(C,b),
	printlinetop(R,w).
printlinetop([], _):-
	write('|').

printlinemiddle([C|R],w):-
	printsquaremiddle(C,w),
	printlinemiddle(R,b).
printlinemiddle([C|R],b):-
	printsquaremiddle(C,b),
	printlinemiddle(R,w).
printlinemiddle([], _):-
	write('|').

printlinebottom([C|R],w):-
	printsquarebottom(C,w),
	printlinebottom(R,b).
printlinebottom([C|R],b):-
	printsquarebottom(C,b),
	printlinebottom(R,w).
printlinebottom([], _):-
	write('|').

% -------------------------------------------------------------------------------------------------------
% printsquaretop, printsquaremiddle e printsquarebottom s�o predicados auxiliares de printlinetop,
% printlinemiddle e printlinebottom respectivamente para visualiza��o do tabuleiro.
% O primeiro parametro de cada um dos predicados corresponde ao elemento da lista correspondente a um 
% quadrado do tabuleiro e convertido para caracteres de representa��o de acordo com os dados do elemento
% (se � uma casa vazia ou se tiver pe�a: o tipo de pe�a, o jogador a quem pertence e a orienta��o desta).
% O segundo parametro identifica a cor do quadrado do tabuleiro (preto ou branco) que tamb�m �
% representada conformemente.
% -------------------------------------------------------------------------------------------------------	
printsquaretop([ _, _, v],w):-
        write('|  ^  ').
printsquaretop([ _, _, v],b):-
        write('|//^//').
printsquaretop( _, w):-
	write('|     ').
printsquaretop( _, b):-
	write('|/////').

printsquaremiddle([ P, M, h], _):-
        write('|< '),
	player(P,M,Letter),
	write(Letter),
	write(' >').
printsquaremiddle([ P, M, v],w):-
        write('|  '),
	player(P,M,Letter),
	write(Letter),
	write('  ').
printsquaremiddle([ P, M, v],b):-
        write('|//'),
	player(P,M,Letter),
	write(Letter),
	write('//').
printsquaremiddle([],w):-
        write('|     ').
printsquaremiddle([],b):-
        write('|/////').

printsquarebottom([ _, _, v],w):-
        write('|  v  ').
printsquarebottom([ _, _, v],b):-
        write('|//v//').
printsquarebottom( _, w):-
	write('|     ').
printsquarebottom( _, b):-
	write('|/////').

% -------------------------------------------------------------------------------------------------------
% Converte o numero de jogador numa letra para representa��o das pe�as
% (minuscula para 'minion' e maiuscula para 'master')
% -------------------------------------------------------------------------------------------------------
player(1,m,a).
player(1,'M','A').
player(2,m,b).
player(2,'M','B').
player(3,m,c).
player(3,'M','C').
player(4,m,d).
player(4,'M','D').

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                                MOVE                                                   %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% -------------------------------------------------------------------------------------------------------
% Rela��o entre os valores numericos e letras das colunas do tabuleiro 
% -------------------------------------------------------------------------------------------------------
column(a,1).
%column('A',1).
column(b,2).
%column('B',2).
column(c,3).
%column('C',3).
column(d,4).
%column('D',4).
column(e,5).
%column('E',5).
column(f,6).
%column('F',6).
column(g,7).
%column('G',7).
column(h,8).
%column('H',8).

% -------------------------------------------------------------------------------------------------------
% Valores v�lidos para o n�mero da linha.
% -------------------------------------------------------------------------------------------------------
row(1).
row(2).
row(3).
row(4).
row(5).
row(6).
row(7).
row(8).

% -------------------------------------------------------------------------------------------------------
% Valores v�lidos para o n�mero de movimentos.
% -------------------------------------------------------------------------------------------------------
nmoves(1).
nmoves(2).
nmoves(3).
nmoves(4).
nmoves(5).
nmoves(6).
nmoves(7).
nmoves(-1).
nmoves(-2).
nmoves(-3).
nmoves(-4).
nmoves(-5).
nmoves(-6).
nmoves(-7).

% -------------------------------------------------------------------------------------------------------
% Verifica se as coordenadas s�o de um canto do tabuleiro.
% -------------------------------------------------------------------------------------------------------
corner(1,a).
corner(1,'A').
corner(1,h).
corner(1,'H').
corner(8,a).
corner(8,'A').
corner(8,h).
corner(8,'H').

% -------------------------------------------------------------------------------------------------------
% Actualiza a lista dos jogadores com a ordem do primeiro master de cada jogador.
% Substitui o valor caso ainda seja o valor inicializado (9) pelo valor obtido pelo predicado 'order'.
% -------------------------------------------------------------------------------------------------------
updatePlayers(Player, Players, Players1):-
	nth1(Player, Players, List),
	nth1(2, List, 9),
	order(Players, Order),
	playerType(Player, Players, PlayerType),
	N is Player - 1,
	length(L, N),
	append(L, [ _ | R ], Players),
	append(L, [ [PlayerType, Order] | R ], Players1).
updatePlayers(_, Players, Players).

% -------------------------------------------------------------------------------------------------------
% Verifica o ultimo numero da ordem das promo��es existente na lista e devolve o valor seguinte
% (ordem com que os jogadores fazem a sua primeira promo��o de minion a master).
% -------------------------------------------------------------------------------------------------------
order(Players, Order):-
	member([ _, 3] , Players),
	Order = 4.
order(Players, Order):-
	member([ _, 2] , Players),
	Order = 3.
order(Players, Order):-
	member([ _, 1] , Players),
	Order = 2.
order(_, 1).

% -------------------------------------------------------------------------------------------------------
% Verifica se a pe�a deve ser promovida - nunca falha.
% Devolve o tipo de pe�a no fim de um movimento e actualiza a lista da ordem das promo��es. 
% -------------------------------------------------------------------------------------------------------
promote(Board, _, Players, Players1, Row, Column, _, _, Type):-
	piece( _, Board, Row, Column, _, 'M'),
	Type = 'M',
	Players1 = Players.
promote(_, Player, Players, Players1, _, _, Row1, Column1, Type):-
	corner(Row1, Column1),
	Type = 'M',
	updatePlayers(Player, Players, Players1).
promote(_, _, Players, Players, _, _, _, _, m).

% -------------------------------------------------------------------------------------------------------
% Alterna a orienta��o da pe�a. 
% -------------------------------------------------------------------------------------------------------
switch_orientation(h,v).
switch_orientation(v,h).

% -------------------------------------------------------------------------------------------------------
% Verifica se a pe�a est� dentro do tabuleiro (coordenadas v�lidas). 
% -------------------------------------------------------------------------------------------------------
inbounds(Row, Column):-
	row(Row),
	column(Column, _).

% -------------------------------------------------------------------------------------------------------
% Verifica uma pe�a da lista correspondente do tabuleiro. Pode ser usado para saber:
% - se existe uma pe�a nas coordenadas dadas;
% - o jogador a qual pertence a pe�a nas coordenadas dadas ou se a pe�a pertence a um jogador dado;
% - qual a orienta��o da pe�a nas coordenadas dadas e ou qual o seu tipo
% -------------------------------------------------------------------------------------------------------
piece(Player, Board, Row, Column, Orientation, Type):-
	column(Column, Elem),
	Line is 9 - Row,
	nth1(Line, Board, Line_list),
	nth1(Elem, Line_list, [Player, Type, Orientation]).

% -------------------------------------------------------------------------------------------------------
% Verifica o n�mero de movimentos de uma pe�a � �mpar ou se a pe�a � master (n�o sujeita a restri��o)
% -------------------------------------------------------------------------------------------------------
odd(_, 'M').
odd(N_moves, _):-
	X is N_moves mod 2,
	X = 1.

% -------------------------------------------------------------------------------------------------------
% Calcula as coordenadas finais de um movimento e se s�o v�lidas
% -------------------------------------------------------------------------------------------------------
position(Row, Column, N_moves, v, Row1, Column1):-
	Row1 is Row + N_moves,
	row(Row1),
	Column1 = Column.
position(Row, Column, N_moves, h, Row1, Column1):-
	Row1 is Row,
	column(Column, C),
	C1 is C + N_moves,
	column(Column1, C1).
	
% -------------------------------------------------------------------------------------------------------
% Verifica se n�o existem pe�as entre as coordenadas iniciais e finais de uma pe�a
% -------------------------------------------------------------------------------------------------------
nojump(_, _, _, 1, _).
nojump(_, _, _, -1, _).
nojump(Board, Row, Column, N, h):-
	N > 1,
	column(Column, C),
	C1 is C + 1,
	column(Column1, C1),
	piece(_, Board, Row, Column1, _, _),
	!,
	fail.
nojump(Board, Row, Column, N, h):-
	N > 1,
	N1 is N - 1,
	column(Column, C),
	C1 is C + 1,
	column(Column1, C1),
	nojump(Board, Row, Column1, N1, h).
nojump(Board, Row, Column, N, h):-
	N < -1,
	column(Column, C),
	C1 is C - 1,
	column(Column1, C1),
	piece(_, Board, Row, Column1, _, _),
	!,
	fail.
nojump(Board, Row, Column, N, h):-
	N < -1,
	N1 is N + 1,
	column(Column, C),
	C1 is C - 1,
	column(Column1, C1),
	nojump(Board, Row, Column1, N1, h).
nojump(Board, Row, Column, N, v):-
	N > 1,
	Row1 is Row + 1,
	piece(_, Board, Row1, Column, _, _),
	!,
	fail.
nojump(Board, Row, Column, N, v):-
	N > 1,
	N1 is N - 1,
	Row1 is Row + 1,
	nojump(Board, Row1, Column, N1, v).
nojump(Board, Row, Column, N, v):-
	N < -1,
	Row1 is Row - 1,
	piece(_, Board, Row1, Column, _, _),
	!,
	fail.
nojump(Board, Row, Column, N, v):-
	N < -1,
	N1 is N + 1,
	Row1 is Row - 1,
	nojump(Board, Row1, Column, N1, v).

% -------------------------------------------------------------------------------------------------------
% Verifica se as coordenadas finais de uma pe�a n�o correspondem a coordenadas de uma pe�a do mesmo
% jogador (jogada ilegal).
% -------------------------------------------------------------------------------------------------------	
no_land_over_own_piece(Board, Player, Row, Column):-
	piece(Player, Board, Row, Column, _, _),
	!,
	fail.
no_land_over_own_piece(_, _, _, _).

% -------------------------------------------------------------------------------------------------------
% Verifica todas as restri��es de movimentos. No caso de input de utilizador (valid_move/8) n�o falha
% mas imprime a primeira restri��o que n�o cumpre e requer novos valores.
% -------------------------------------------------------------------------------------------------------
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	piece(Player, Board, Row, Column, Orientation, Type),
	odd(N_moves, Type),
	position(Row, Column, N_moves, Orientation, Row1, Column1),
	nojump(Board, Row, Column, N_moves, Orientation),
	no_land_over_own_piece(Board, Player, Row1, Column1),
	!,
	Row_valid = Row,
	Column_valid = Column,
	N_moves_valid = N_moves.
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	piece(Player, Board, Row, Column, Orientation, Type),
	odd(N_moves, Type),
	position(Row, Column, N_moves, Orientation, _, _),
	nojump(Board, Row, Column, N_moves, Orientation),
	write('Cannot move over one of your pieces. Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	piece(Player, Board, Row, Column, Orientation, Type),
	odd(N_moves, Type),
	position(Row, Column, N_moves, Orientation, _, _),
	write('Cannot jump over other pieces. Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	piece(Player, Board, Row, Column, _, Type),
	odd(N_moves, Type),
	write('Not a valid number of steps (out of bounds). Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	piece(Player, Board, Row, Column, _, _),
	write('Not a valid number of steps (piece is minion, must be odd). Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, N_moves, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	N_moves \= 0,
	write('Not a valid piece. Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, _, Row_valid, Column_valid, N_moves_valid):-
	inbounds(Row, Column),
	write('Number of moves cannot be zero. Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, _, _, _, Row_valid, Column_valid, N_moves_valid):-
	write('Not a valid position in the board. Try again.'), nl, nl,
	!,
	choose_move(Player, human, Board, Row_valid, Column_valid, N_moves_valid).
valid_move(Player, Board, Row, Column, N_moves):-
	column(Column, _),
	row(Row),
	nmoves(N_moves),
	piece(Player, Board, Row, Column, Orientation, Type),
	odd(N_moves, Type),
	position(Row, Column, N_moves, Orientation, Row1, Column1),
	%inbounds(Row1, Column1),
	nojump(Board, Row, Column, N_moves, Orientation),
	no_land_over_own_piece(Board, Player, Row1, Column1).

% -------------------------------------------------------------------------------------------------------
% Verifica se n�o existem jogadas poss�veis.
% -------------------------------------------------------------------------------------------------------
no_valid_moves(Player, Board):-
	valid_move(Player, Board, _, _, _),
	!,
	fail.
no_valid_moves(_, _).

% -------------------------------------------------------------------------------------------------------
% Verifica se entre as jogadas possiveis numa lista existem jogadas para promover minions e guarda as numa
% outra lista.
% -------------------------------------------------------------------------------------------------------
corner_moves(_, [], []).
corner_moves(Board, [[Row, Column, N_moves]|T], [[Row, Column, N_moves]|T1]):-
	piece(_, Board, Row, Column, Orientation, m),
	position(Row, Column, N_moves, Orientation, Row1, Column1),
	corner(Row1, Column1),
	!,
	corner_moves(Board, T, T1).
corner_moves(Board, [_|T], T1):- corner_moves(Board, T, T1).

% -------------------------------------------------------------------------------------------------------
% Verifica se entre as jogadas possiveis numa lista existem jogadas para eliminiar pe�as do adversario
% e guarda as numa outra lista.
% -------------------------------------------------------------------------------------------------------
eliminate_moves(_, [], []).
eliminate_moves(Board, [[Row, Column, N_moves]|T], [[Row, Column, N_moves]|T1]):-
	piece(_, Board, Row, Column, Orientation, _),
	position(Row, Column, N_moves, Orientation, Row1, Column1),
	piece(_, Board, Row1, Column1, _, _),
	!,
	eliminate_moves(Board, T, T1).
eliminate_moves(Board, [_|T], T1):- eliminate_moves(Board, T, T1).

% -------------------------------------------------------------------------------------------------------
% No caso de ser 'humano', pede input at� conseguir uma jogada v�lida.
% No caso de o tipo de jogador ser 'computador' procura todas as jogadas validas e dentro dessas as para
% promover minions e as para eliminiar pe�as do adversario atraves dos respectivos predicados e guarda-as
% em listas diferentes. Utiliza 'choose_priority' para obter uma jogada aleat�ria dessas listas.
% -------------------------------------------------------------------------------------------------------
choose_move(Player, computer, Board, Row, Column, N_moves):-
	findall([Row, Column, N_moves], valid_move(Player, Board, Row, Column, N_moves), List_moves),
	corner_moves(Board, List_moves, List_corners),
	eliminate_moves(Board, List_moves, List_eliminate),
	choose_priority(List_moves, List_eliminate, List_corners, Row, Column, N_moves),
	%sleep(1),
	write('[Computer] Row: '), write(Row), write(', Column: '), write(Column), write(', Number of moves: '), write(N_moves), nl.
	%sleep(1).
choose_move(Player, human, Board, Row, Column, N_moves):-
	write('Choose piece�s row [1-8] '), read(Row_input), 
	write('Choose piece�s column [a-h] '), read(Column_input),
	write('Choose number of moves [positive for up/right, negative for down/left] '), read(N_moves_input),
	valid_move(Player, Board, Row_input, Column_input, N_moves_input, Row, Column, N_moves).

% -------------------------------------------------------------------------------------------------------
% Escolhe uma jogada aleat�ria seguindo as seguintes prioridades:
% - se existir uma jogada para promover um minion escolhe uma jogada aleat�ria dessa lista;
% - se existir uma jogada para eliminar uma pe�a do advers�rio escolhe uma jogada aleat�ria dessa lista;
% - escolhe uma jogada qualquer aleatoriamente. 
% -------------------------------------------------------------------------------------------------------
choose_priority(List, [], [], Row, Column, N_moves):-
	length(List, Size),
	Max is Size + 1,
	random(1, Max, Rand),
	nth1(Rand, List, [Row, Column, N_moves]).
choose_priority(_, List, [], Row, Column, N_moves):-
	length(List, Size),
	Max is Size + 1,
	random(1, Max, Rand),
	nth1(Rand, List, [Row, Column, N_moves]).
choose_priority(_, _, List, Row, Column, N_moves):-
	length(List, Size),
	Max is Size + 1,
	random(1, Max, Rand),
	nth1(Rand, List, [Row, Column, N_moves]).

% -------------------------------------------------------------------------------------------------------
% Substitui o elemento correspondente a uma pe�a na lista correspondente ao tabuleiro por um elemento
% vazio ([]). Corresponde a uma pe�a deslocar-se da sua posi��o actual.
% -------------------------------------------------------------------------------------------------------
erase_initial_pos(Board1, Board2, Row, Column):-
	Line_N is 9 - Row,
	N1 is Line_N - 1,
	length(L1, N1),
	append(L1, [ Line1 | R1 ], Board1),
	column(Column, Elem_N),
	N2 is Elem_N - 1,
	length(L2, N2),
	append(L2, [ _ | R2 ], Line1),
	append(L2, [ [] | R2 ], Line2),
	append(L1, [ Line2 | R1 ], Board2).

% -------------------------------------------------------------------------------------------------------
% Substitui na lista correspondente ao tabuleiro o elemento correspondente � nova posi��o de uma pe�a
% pela informa��o correspondente a esta e devolve o tabuleiro actualizado.
% -------------------------------------------------------------------------------------------------------
land(Board1, Board2, Row, Column, Player, Type, Orientation):-
	switch_orientation(Orientation, Orientation1),
	Line_N is 9 - Row,
	N1 is Line_N - 1,
	length(L1, N1),
	append(L1, [ Line1 | R1 ], Board1),
	column(Column, Elem_N),
	N2 is Elem_N - 1,
	length(L2, N2),
	append(L2, [ _ | R2 ], Line1),
	append(L2, [ [Player, Type, Orientation1] | R2 ], Line2),
	append(L1, [ Line2 | R1 ], Board2).

% -------------------------------------------------------------------------------------------------------
% Move uma pe�a e actualiza o tabuleiro.
% -------------------------------------------------------------------------------------------------------
move(Player, Players, Players1, Board_start, Board_final, Row, Column, N_moves):-
	erase_initial_pos(Board_start, Board_erased_init, Row, Column),
	piece( _, Board_start, Row, Column, Orientation, _),
	position(Row, Column, N_moves, Orientation, Row1, Column1),
	promote(Board_start, Player, Players, Players1, Row, Column, Row1, Column1, Type),
	land(Board_erased_init, Board_final, Row1, Column1, Player, Type, Orientation).	

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                               PLAY                                                    %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% -------------------------------------------------------------------------------------------------------
% Calcula qual o pr�ximo jogador em fun��o do n�mero de jogadores
% -------------------------------------------------------------------------------------------------------
nextPlayer(Player, N_Players, Player1):-
	Player < N_Players,
	Player1 is Player + 1.
nextPlayer(N_Players, N_Players, Player1):-
	Player1 = 1.

% -------------------------------------------------------------------------------------------------------
% Verifica se o jogador j� foi eliminado (se j� n�o possui pe�as no tabuleiro).
% -------------------------------------------------------------------------------------------------------
player_eliminated(Player, Board):-
	member(Line, Board),
	member([Player,_,_], Line),
	!,
	fail.
player_eliminated(_, _).

% -------------------------------------------------------------------------------------------------------
% Verifica se o jogador j� n�o existem pe�as do tipo minion no tabuleiro (condi��o de fim de jogo).
% -------------------------------------------------------------------------------------------------------
no_minions(Board, _, _, _):-
	member(Line, Board),
	member(Square, Line),
	member(m, Square),
	!,
	fail.
no_minions(Board, Players, Winner, WinClause):-
	mostMasters(Board, Players, Winner, WinClause).

% -------------------------------------------------------------------------------------------------------
% Verifica qual o jogador com mais pe�as do tipo master. No caso de empate verifica condi��o de desempate.
% -------------------------------------------------------------------------------------------------------	
mostMasters(Board, Players, Winner, WinClause):-
	count_masters(1, Board, Players, [], List),
	check_tie(List, Players, Winner, WinClause).

% -------------------------------------------------------------------------------------------------------
% Contabiliza o numero de pe�as do tipo master para cada jogador e devolve uma lista com estes valores.
% -------------------------------------------------------------------------------------------------------	
count_masters(Player, _, Players, List, List):-
	length(Players,N),
	Player > N.
count_masters(Player, Board, Players, List, List2):-
	count_player_masters(Player, 0, Board, List, List1),
	Player1 is Player + 1,
	count_masters(Player1, Board, Players, List1, List2).

% -------------------------------------------------------------------------------------------------------
% Contabiliza o numero de pe�as do tipo master de um jogador e acrescenta-o a uma lista.
% -------------------------------------------------------------------------------------------------------	
count_player_masters(_, Sum, [], List, List1):-
	append(List, [Sum], List1).
count_player_masters(Player, Sum, [H|T], List, List1):-
	delete(H, [Player, _, _], Rest),
	delete(Rest, [Player, _, _], Rest1),
	delete(Rest1, [Player, _, _], Rest2),
	delete(Rest2, [Player, _, _], Rest3),
	length(Rest3,N),
	Sum1 is Sum + 8 - N,
	count_player_masters(Player, Sum1, T, List, List1).

% -------------------------------------------------------------------------------------------------------
% Verifica se existe mais que um jogador com o maior n�mero de masters. Se existir verifica o crit�rio de
% desempate (primeiro a promover uma pe�a). Devolve sempre o vencedor.
% -------------------------------------------------------------------------------------------------------	
check_tie(List, Players, Winner, 'First Master'):-
	max_member(Max, List),
	nth1(P1, List, Max),
	nth1(P2, List, Max),
	P1 \= P2,
	!,
	firstMaster(List, Max, 1, Players, Winner).
check_tie(List, _, Winner, 'Most Minions'):-
	max_member(Max, List),
	nth1(Winner, List, Max).	

% -------------------------------------------------------------------------------------------------------
% Verifica qual dos jogadores com o maior n�mero de masters foi primeiro a promover uma pe�a.
% Devolve o vencedor.
% -------------------------------------------------------------------------------------------------------
firstMaster(List, Max, Order, Players, Winner):-
	nth1(Winner, Players, [ _, Order]),
	nth1(Winner, List, Max).
firstMaster(List, Max, Order, Players, Winner):-
	Order1 is Order + 1,
	firstMaster(List, Max, Order1, Players, Winner).

% -------------------------------------------------------------------------------------------------------
% Verifica se s� existe um jogador com pe�as no tabuleiro (condi��o de fim de jogo).
% -------------------------------------------------------------------------------------------------------	
only_one_player(Board, _):-
	member(Line1, Board),
	member([P1,_,_], Line1),
	member(Line2, Board),
	member([P2,_,_], Line2),
	P1 \= P2,
	!,
	fail.
only_one_player(Board, Player):-
	member(Line1, Board),
	member([Player,_,_], Line1).

% -------------------------------------------------------------------------------------------------------
% Verifica as condi��es de fim de jogo. Caso se verifique devolve o vencedor e a condi��o.
% -------------------------------------------------------------------------------------------------------	
game_over(Board, Players, Winner, WinClause):- no_minions(Board, Players, Winner, WinClause).
game_over(Board, _, Winner, 'Last player standing'):- only_one_player(Board, Winner).

% -------------------------------------------------------------------------------------------------------
% Verifica o tipo de jogador (humano ou computador).
% -------------------------------------------------------------------------------------------------------
playerType(Player, Players, PlayerType):-
	nth1(Player, Players, List),
	nth1(1, List, PlayerType).

% -------------------------------------------------------------------------------------------------------
% Jogadas - os jogadores fazem jogadas � vez enquanto n�o se verificar nenhuma condi��o de fim de jogo.
% No caso de um jogador ter sido eliminado ou n�o ter nenhuma jogada possivel passa a vez.
% -------------------------------------------------------------------------------------------------------	
play( _, _, Players, Board):-
	game_over(Board, Players, Winner, WinClause),
	!,
	player(Winner, 'M', Letter),
	write('Game Ended'), nl, nl, write('Player '), write(Letter), write(' is the winner ('), write(WinClause), write(')!'), nl.
play(Player, N_Players, Players, Board):-
	player_eliminated(Player, Board),
	!,
	player(Player, 'M', Letter),
	write('Player '), write(Letter), write(' has been eliminated.'), nl, nl,
	nextPlayer(Player, N_Players, Player1),
	play(Player1, N_Players, Players, Board).
play(Player, N_Players, Players, Board):-
	no_valid_moves(Player, Board),
	!,
	player(Player, 'M', Letter),
	write('Player '), write(Letter), write(' is skiping is turn because there are no valid moves.'), nl, nl,
	nextPlayer(Player, N_Players, Player1),
	play(Player1, N_Players, Players, Board).
play(Player, N_Players, Players, Board):-
	player(Player, 'M', Letter),
	write('Player '), write(Letter), write(', make your move.'), nl,
	playerType(Player, Players, PlayerType),
	choose_move(Player, PlayerType, Board, Row, Column, N_moves), nl,
	move(Player, Players, Players1, Board, Board1, Row, Column, N_moves),
	display_game(Board1),
	nextPlayer(Player, N_Players, Player1),
	play(Player1, N_Players, Players1, Board1).

% -------------------------------------------------------------------------------------------------------
% Inicia o jogo.
% -------------------------------------------------------------------------------------------------------	
pivit:-
	use_module(library(lists)),
	use_module(library(random)),
	use_module(library(system)),
	nl, nl, nl, nl, nl, write('---------Welcome to Pivit!---------'), nl, nl,
	initializeBoard(N_Players, Board), nl,
	initializeAI(N_Players, Players), nl,
	display_game(Board),
	play(1, N_Players, Players, Board).
	
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                             LAIG                                                      %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

newgame(N_Players, PlayerTypes, Players, Board):-
	length(PlayerTypes, N_Players),
	getBoard(N_Players, _, Board),
	parseAI(PlayerTypes, Players).
	
parseAI(PlayerTypes, Players):-
	parseAI(PlayerTypes, [], Players).
parseAI([], Players, Players).
parseAI([human|T], Players_0, Players):-
	append(Players_0, [[human,9]], Players_1),
	parseAI(T, Players_1, Players).
parseAI([pc|T], Players_0, Players):-
	append(Players_0, [[computer,9]], Players_1),
	parseAI(T, Players_1, Players).


	

